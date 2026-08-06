import {
  CoreHttpError,
  cleanupRateLimitStore,
  consumeRateLimit,
  createAssistantSseStream,
  createPortfolioApiRuntime,
  isRecord,
  PORTFOLIO_API_ROUTES,
  type PortfolioApiRuntime,
  type PortfolioEmailDelivery,
  RATE_LIMIT_PRESETS,
  type RateLimitEntry,
  type RateLimiterOptions,
} from '../../shared/portfolio/portfolioRuntime.js';
import {
  findExtensionLegalRedirect,
  findStaticProductPage,
} from '../../shared/portfolio/productRegistry.js';
import { createFetchOpenAiAssistantProvider } from './openAiAssistantProvider.js';

type AssetFetcher = {
  fetch(request: Request): Promise<Response>;
};

/** Minimal R2 object shape used for long-cache media responses. */
type R2ObjectBody = {
  body: ReadableStream;
  httpEtag?: string;
  httpMetadata?: { contentType?: string };
  size: number;
};

type R2BucketBinding = {
  get(key: string): Promise<R2ObjectBody | null>;
};

export type Env = {
  ASSETS: AssetFetcher;
  /** Portfolio media (WebP stack/hero/blog/screenshots) with immutable cache. */
  MEDIA?: R2BucketBinding;
  OPENAI_API_KEY?: string;
  FRONTEND_URL?: string;
  CONTACT_RECIPIENT?: string;
  EMAIL_FROM?: string;
  EMAIL?: {
    send(message: {
      to: string;
      from: { email: string; name?: string } | string;
      replyTo?: { email: string; name?: string } | string;
      subject: string;
      html: string;
      text: string;
    }): Promise<unknown>;
  };
};

export type WorkerRuntime = {
  fetch(request: Request, env: Env): Promise<Response>;
};

const MEDIA_CACHE_CONTROL = 'public, max-age=31536000, immutable';

const createWorkerApiRuntime = (env: Env): PortfolioApiRuntime =>
  createPortfolioApiRuntime({
    assistantProvider: createFetchOpenAiAssistantProvider(env),
    emailDelivery: createWorkerEmailDelivery(env),
    contactRecipient: env.CONTACT_RECIPIENT,
  });

const createWorkerEmailDelivery = (env: Env): PortfolioEmailDelivery => ({
  isConfigured: () => Boolean(env.EMAIL && env.EMAIL_FROM),
  send: async ({ emailInput, email, recipient }) => {
    if (!env.EMAIL || !env.EMAIL_FROM) {
      throw new CoreHttpError('Email service is not configured', 503);
    }

    await env.EMAIL.send({
      to: recipient,
      from: { email: env.EMAIL_FROM, name: 'Portfolio Contact' },
      replyTo: {
        email: emailInput.senderEmail,
        name: emailInput.senderName,
      },
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  },
});

/**
 * Fetches a path from the Workers Assets binding, preserving request headers.
 *
 * @param request - Incoming request (headers/method source).
 * @param env - Worker bindings.
 * @param assetPath - Absolute asset path under dist/ (e.g. `/v4/index.html`).
 * @param method - HTTP method for the asset request.
 * @returns Asset fetch promise.
 */
const fetchAssetPath = (
  request: Request,
  env: Env,
  assetPath: string,
  method = request.method,
): Promise<Response> => {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = assetPath;
  return env.ASSETS.fetch(
    new Request(assetUrl.toString(), {
      headers: request.headers,
      method,
    }),
  );
};

/**
 * Maps a media object key to a Content-Type when R2 metadata is empty.
 *
 * @param key - R2 object key.
 * @returns MIME type string.
 * @example
 * guessMediaContentType('v4/blog/x.webp') // 'image/webp'
 */
const guessMediaContentType = (key: string): string => {
  // Raw example: "v4/blog/x.webp" -> extension "webp"
  const extension = key.toLowerCase().split('.').at(-1) ?? '';

  switch (extension) {
    case 'webp':
      return 'image/webp';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    case 'gif':
      return 'image/gif';
    case 'avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
};

/**
 * Serves WebP (and other) media from R2 with year-long immutable cache headers.
 * Falls back to Workers Assets when the object is missing so local previews and
 * partial uploads keep working.
 *
 * @param request - Incoming request.
 * @param env - Worker bindings.
 * @param url - Parsed request URL.
 * @returns Media response or 404.
 */
const handleMediaRequest = async (request: Request, env: Env, url: URL): Promise<Response> => {
  // Raw row example: "/media/v4/images-of-me/x.webp" → key "v4/images-of-me/x.webp".
  const key = url.pathname.replace(/^\/media\//, '').replace(/^\/+/, '');
  if (!key || key.includes('..')) {
    return new Response('Not found', { status: 404 });
  }

  if (env.MEDIA) {
    const mediaObject = await env.MEDIA.get(key);
    if (mediaObject) {
      const headers = new Headers();
      headers.set(
        'Content-Type',
        mediaObject.httpMetadata?.contentType ?? guessMediaContentType(key),
      );
      headers.set('Cache-Control', MEDIA_CACHE_CONTROL);
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Media-Source', 'r2');
      if (mediaObject.httpEtag) {
        headers.set('ETag', mediaObject.httpEtag);
      }
      headers.set('Content-Length', String(mediaObject.size));
      return new Response(mediaObject.body, { headers });
    }
  }

  // Fallback: same file under the static tree (Workers Assets).
  // Raw key "v4/blog/x.webp" already matches dist layout.
  const assetResponse = await fetchAssetPath(request, env, `/${key}`, 'GET');
  if (!assetResponse.ok) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers(assetResponse.headers);
  headers.set('Cache-Control', MEDIA_CACHE_CONTROL);
  headers.set('X-Media-Source', 'assets-fallback');
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    headers,
  });
};

const isAllowedOrigin = (origin: string, env: Env): boolean => {
  const frontendUrl = env.FRONTEND_URL === undefined ? '' : env.FRONTEND_URL;
  const allowedOrigins = new Set(
    // Raw row example: "https://a.test,https://b.test" splits into allowed origins.
    frontendUrl
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );

  try {
    const originUrl = new URL(origin);
    return (
      allowedOrigins.has(origin) ||
      originUrl.hostname === 'localhost' ||
      originUrl.hostname.endsWith('.workers.dev')
    );
  } catch {
    return false;
  }
};

const corsHeaders = (request: Request, env: Env): Headers => {
  const origin = request.headers.get('Origin');
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  });

  if (origin && isAllowedOrigin(origin, env)) {
    headers.set('Access-Control-Allow-Origin', origin);
  }

  return headers;
};

const jsonResponse = (request: Request, env: Env, jsonValue: unknown, status = 200): Response => {
  const headers = new Headers(corsHeaders(request, env));
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(jsonValue), { status, headers });
};

const readJsonRecord = async (request: Request): Promise<Record<string, unknown>> => {
  try {
    const parsedJson = await request.json();
    if (!isRecord(parsedJson)) {
      throw new CoreHttpError('Invalid request body', 400);
    }
    return parsedJson;
  } catch (error) {
    if (error instanceof CoreHttpError) {
      throw error;
    }
    throw new CoreHttpError('Invalid JSON body', 400);
  }
};

const getClientIp = (request: Request): string => {
  const cfConnectingIp = request.headers.get('CF-Connecting-IP');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  const forwarded = request.headers.get('X-Forwarded-For');
  if (forwarded) {
    // Raw row example: "203.0.113.7, 198.51.100.9" uses the first forwarded IP.
    const [firstForwardedIp] = forwarded.split(',');
    const clientIp = firstForwardedIp === undefined ? '' : firstForwardedIp.trim();
    return clientIp.length > 0 ? clientIp : 'unknown';
  }

  return 'unknown';
};

const isApiPath = (pathname: string): boolean =>
  pathname === '/health' || pathname.startsWith('/api/');

const withRateLimit = async (
  request: Request,
  env: Env,
  rateLimitStore: Map<string, RateLimitEntry>,
  options: RateLimiterOptions,
  handler: () => Promise<Response>,
): Promise<Response> => {
  cleanupRateLimitStore(rateLimitStore);
  const rateLimit = consumeRateLimit(rateLimitStore, getClientIp(request), options);

  if (!rateLimit.allowed) {
    return jsonResponse(request, env, rateLimit.body, rateLimit.status);
  }

  const limitedResponse = await handler();
  for (const [header, value] of Object.entries(rateLimit.headers)) {
    limitedResponse.headers.set(header, value);
  }
  return limitedResponse;
};

const handleChat = async (
  request: Request,
  env: Env,
  api: PortfolioApiRuntime,
): Promise<Response> => {
  const reply = await api.createChatReply(await readJsonRecord(request));
  const chatResponse = jsonResponse(request, env, {
    success: true,
    message: reply.message,
  });
  chatResponse.headers.set('X-Cache', reply.cacheStatus);
  return chatResponse;
};

const handleChatStream = async (
  request: Request,
  env: Env,
  api: PortfolioApiRuntime,
): Promise<Response> => {
  const chatStream = await api.createChatReplyStream(await readJsonRecord(request));
  const headers = new Headers(corsHeaders(request, env));
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');
  headers.set('X-Accel-Buffering', 'no');
  headers.set('X-Cache', chatStream.cacheStatus);

  return new Response(createAssistantSseStream(chatStream.events), { headers });
};

const handleTextToSpeech = async (
  request: Request,
  env: Env,
  api: PortfolioApiRuntime,
): Promise<Response> => {
  const speech = await api.createTextToSpeech(await readJsonRecord(request));
  const headers = new Headers(corsHeaders(request, env));
  headers.set('Content-Type', speech.contentType);
  headers.set('Cache-Control', speech.cacheControl);
  return new Response(speech.audio, { headers });
};

const handleSpeechToText = async (
  request: Request,
  env: Env,
  api: PortfolioApiRuntime,
): Promise<Response> => {
  const audioBuffer = await request.arrayBuffer();
  const contentTypeHeader = request.headers.get('Content-Type');
  const transcript = await api.createSpeechToText({
    contentType: contentTypeHeader === null ? '' : contentTypeHeader,
    audio: audioBuffer,
  });
  return jsonResponse(request, env, { success: true, text: transcript });
};

const handleSendEmail = async (
  request: Request,
  env: Env,
  api: PortfolioApiRuntime,
): Promise<Response> =>
  jsonResponse(request, env, await api.sendPortfolioEmail(await readJsonRecord(request)));

const handleApiRequest = async (
  request: Request,
  env: Env,
  url: URL,
  rateLimitStore: Map<string, RateLimitEntry>,
): Promise<Response> => {
  const api = createWorkerApiRuntime(env);
  const { pathname } = url;
  const { method } = request;
  const routes = PORTFOLIO_API_ROUTES;

  if (pathname === routes.chatHealth.path && method === routes.chatHealth.method) {
    return jsonResponse(request, env, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      ...api.getChatHealth(),
    });
  }

  if (pathname === routes.emailHealth.path && method === routes.emailHealth.method) {
    return jsonResponse(request, env, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      ...api.getEmailHealth(),
    });
  }

  if (pathname === routes.chat.path && method === routes.chat.method) {
    return withRateLimit(request, env, rateLimitStore, RATE_LIMIT_PRESETS.chat, () =>
      handleChat(request, env, api),
    );
  }

  if (pathname === routes.chatStream.path && method === routes.chatStream.method) {
    return withRateLimit(request, env, rateLimitStore, RATE_LIMIT_PRESETS.chat, () =>
      handleChatStream(request, env, api),
    );
  }

  if (pathname === routes.textToSpeech.path && method === routes.textToSpeech.method) {
    return withRateLimit(request, env, rateLimitStore, RATE_LIMIT_PRESETS.voice, () =>
      handleTextToSpeech(request, env, api),
    );
  }

  if (pathname === routes.speechToText.path && method === routes.speechToText.method) {
    return withRateLimit(request, env, rateLimitStore, RATE_LIMIT_PRESETS.voice, () =>
      handleSpeechToText(request, env, api),
    );
  }

  if (pathname === routes.sendEmail.path && method === routes.sendEmail.method) {
    return withRateLimit(request, env, rateLimitStore, RATE_LIMIT_PRESETS.emailWorker, () =>
      handleSendEmail(request, env, api),
    );
  }

  throw new CoreHttpError('Not found', 404);
};

/**
 * SPA fallback for nested eras: client-side routes (no file extension) serve
 * that era's own index.html so Cloudflare's root SPA fallback does not win.
 *
 * @param request - Incoming request.
 * @param env - Worker bindings.
 * @param pathname - Request pathname.
 * @returns Era index response, or null when the path is not a nested-era SPA route.
 */
const tryNestedEraSpaFallback = (
  request: Request,
  env: Env,
  pathname: string,
): Promise<Response> | null => {
  // Raw row example: "/v4/work" -> era "v4".
  const nestedEraMatch = pathname.match(/^\/(v[124])(?:\/|$)/);
  if (!nestedEraMatch) {
    return null;
  }

  const era = nestedEraMatch[1];
  // Raw example: "/v4/work" last segment "work" (no extension) -> SPA index.
  // Raw example: "/v4/app.js" last segment "app.js" -> asset passthrough.
  const lastSegment = pathname.split('/').at(-1) ?? '';
  if (lastSegment.includes('.')) {
    return null;
  }

  return fetchAssetPath(request, env, `/${era}/index.html`);
};

const handleWorkerRequest = async (
  request: Request,
  env: Env,
  rateLimitStore: Map<string, RateLimitEntry>,
): Promise<Response> => {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS' && isApiPath(url.pathname)) {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request, env),
    });
  }

  try {
    // Default era: bare root goes to the current flagship (v4 / JTS).
    // 302 (not 301) keeps the default swappable without fighting hard caches.
    // Raw example: "https://site/?ref=x" -> "https://site/v4/?ref=x".
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const target = new URL('/v4/', url);
      target.search = url.search;
      return Response.redirect(target.toString(), 302);
    }

    if (url.pathname === '/health') {
      return jsonResponse(request, env, {
        status: 'ok',
        runtime: 'cloudflare-worker',
        timestamp: new Date().toISOString(),
      });
    }

    // Long-cache R2 media: /media/v4/images-of-me/stack-react-3d.webp
    if (url.pathname.startsWith('/media/')) {
      return await handleMediaRequest(request, env, url);
    }

    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(request, env, url, rateLimitStore);
    }

    const legalRedirectUrl = findExtensionLegalRedirect(url.pathname);
    if (legalRedirectUrl) {
      return Response.redirect(legalRedirectUrl, 301);
    }

    const staticProductPage = findStaticProductPage(url.pathname);
    if (staticProductPage) {
      return fetchAssetPath(request, env, `/${staticProductPage}`);
    }

    const eraSpaResponse = tryNestedEraSpaFallback(request, env, url.pathname);
    if (eraSpaResponse) {
      return eraSpaResponse;
    }

    return env.ASSETS.fetch(request);
  } catch (error) {
    if (error instanceof CoreHttpError) {
      return jsonResponse(request, env, { success: false, error: error.message }, error.status);
    }

    return jsonResponse(
      request,
      env,
      { success: false, error: 'An unexpected error occurred' },
      500,
    );
  }
};

/**
 * Creates the Cloudflare Worker fetch runtime (assets, Product Route Registry,
 * media, and portfolio API).
 *
 * @param options.rateLimitStore - Optional shared rate-limit map (tests / multi-isolate).
 * @returns Worker runtime with a `fetch` handler.
 */
export const createWorkerRuntime = ({
  rateLimitStore = new Map<string, RateLimitEntry>(),
}: {
  rateLimitStore?: Map<string, RateLimitEntry>;
} = {}): WorkerRuntime => ({
  fetch: (request: Request, env: Env): Promise<Response> =>
    handleWorkerRequest(request, env, rateLimitStore),
});
