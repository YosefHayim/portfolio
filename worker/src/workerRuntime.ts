import {
  findExtensionLegalRedirect,
  findStaticProductPage,
} from '../../shared/portfolio/productRegistry.js';
import {
  CoreHttpError,
  PORTFOLIO_API_ROUTES,
  RATE_LIMIT_PRESETS,
  cleanupRateLimitStore,
  consumeRateLimit,
  createAssistantSseStream,
  createPortfolioApiRuntime,
  isRecord,
  type RateLimitEntry,
  type RateLimiterOptions,
  type PortfolioEmailDelivery,
} from '../../shared/portfolio/portfolioRuntime.js';
import { createFetchOpenAiAssistantProvider } from './openAiAssistantProvider.js';

type AssetFetcher = {
  fetch(request: Request): Promise<Response>;
};

export type Env = {
  ASSETS: AssetFetcher;
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

export const createWorkerRuntime = ({
  rateLimitStore = new Map<string, RateLimitEntry>(),
}: {
  rateLimitStore?: Map<string, RateLimitEntry>;
} = {}): WorkerRuntime => ({
  fetch: async (request: Request, env: Env): Promise<Response> =>
    handleWorkerRequest(request, env, rateLimitStore),
});

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
    if (url.pathname === '/health') {
      return jsonResponse(request, env, {
        status: 'ok',
        runtime: 'cloudflare-worker',
        timestamp: new Date().toISOString(),
      });
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
      return fetchStaticProductPage(request, env, staticProductPage);
    }

    // SPA fallback for v1/v2: if the path is a client-side route (no file
    // extension), serve the era's own index.html so its React Router boots.
    // Cloudflare's built-in SPA fallback would serve the root index.html (v3).
    if (url.pathname.startsWith('/v1/') || url.pathname.startsWith('/v2/')) {
      const era = url.pathname.startsWith('/v1/') ? 'v1' : 'v2';
      // Raw row example: "/v1/about" splits into ["", "v1", "about"].
      const pathnameSegments = url.pathname.split('/');
      const segment = pathnameSegments.at(-1);
      const lastSegment = segment === undefined ? '' : segment;
      const hasExtension = lastSegment.includes('.');

      if (!hasExtension) {
        // Client-side route — serve the era's index.html
        const eraIndexUrl = new URL(request.url);
        eraIndexUrl.pathname = `/${era}/index.html`;
        return env.ASSETS.fetch(
          new Request(eraIndexUrl.toString(), {
            headers: request.headers,
            method: request.method,
          }),
        );
      }
    }

    return env.ASSETS.fetch(request);
  } catch (error) {
    const message =
      error instanceof CoreHttpError
        ? error.message
        : 'An unexpected error occurred';
    const status = error instanceof CoreHttpError ? error.status : 500;
    return jsonResponse(
      request,
      env,
      { success: false, error: message },
      status,
    );
  }
};

const handleApiRequest = async (
  request: Request,
  env: Env,
  url: URL,
  rateLimitStore: Map<string, RateLimitEntry>,
): Promise<Response> => {
  if (
    url.pathname === PORTFOLIO_API_ROUTES.chatHealth.path &&
    request.method === PORTFOLIO_API_ROUTES.chatHealth.method
  ) {
    return jsonResponse(request, env, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      ...createWorkerApiRuntime(env).getChatHealth(),
    });
  }

  if (
    url.pathname === PORTFOLIO_API_ROUTES.emailHealth.path &&
    request.method === PORTFOLIO_API_ROUTES.emailHealth.method
  ) {
    return jsonResponse(request, env, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      ...createWorkerApiRuntime(env).getEmailHealth(),
    });
  }

  if (
    url.pathname === PORTFOLIO_API_ROUTES.chat.path &&
    request.method === PORTFOLIO_API_ROUTES.chat.method
  ) {
    return withRateLimit(
      request,
      env,
      rateLimitStore,
      RATE_LIMIT_PRESETS.chat,
      () => handleChat(request, env),
    );
  }

  if (
    url.pathname === PORTFOLIO_API_ROUTES.chatStream.path &&
    request.method === PORTFOLIO_API_ROUTES.chatStream.method
  ) {
    return withRateLimit(
      request,
      env,
      rateLimitStore,
      RATE_LIMIT_PRESETS.chat,
      () => handleChatStream(request, env),
    );
  }

  if (
    url.pathname === PORTFOLIO_API_ROUTES.textToSpeech.path &&
    request.method === PORTFOLIO_API_ROUTES.textToSpeech.method
  ) {
    return withRateLimit(
      request,
      env,
      rateLimitStore,
      RATE_LIMIT_PRESETS.voice,
      () => handleTextToSpeech(request, env),
    );
  }

  if (
    url.pathname === PORTFOLIO_API_ROUTES.speechToText.path &&
    request.method === PORTFOLIO_API_ROUTES.speechToText.method
  ) {
    return withRateLimit(
      request,
      env,
      rateLimitStore,
      RATE_LIMIT_PRESETS.voice,
      () => handleSpeechToText(request, env),
    );
  }

  if (
    url.pathname === PORTFOLIO_API_ROUTES.sendEmail.path &&
    request.method === PORTFOLIO_API_ROUTES.sendEmail.method
  ) {
    return withRateLimit(
      request,
      env,
      rateLimitStore,
      RATE_LIMIT_PRESETS.emailWorker,
      () => handleSendEmail(request, env),
    );
  }

  throw new CoreHttpError('Not found', 404);
};

const withRateLimit = async (
  request: Request,
  env: Env,
  rateLimitStore: Map<string, RateLimitEntry>,
  options: RateLimiterOptions,
  handler: () => Promise<Response>,
): Promise<Response> => {
  cleanupRateLimitStore(rateLimitStore);
  const result = consumeRateLimit(
    rateLimitStore,
    getClientIp(request),
    options,
  );

  if (!result.allowed) {
    return jsonResponse(request, env, result.body, result.status);
  }

  const response = await handler();
  for (const [header, value] of Object.entries(result.headers)) {
    response.headers.set(header, value);
  }
  return response;
};

const handleChat = async (request: Request, env: Env): Promise<Response> => {
  const reply = await createWorkerApiRuntime(env).createChatReply(
    await readJson(request),
  );

  const response = jsonResponse(request, env, {
    success: true,
    message: reply.message,
  });
  response.headers.set('X-Cache', reply.cacheStatus);
  return response;
};

const handleChatStream = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const streamResult = await createWorkerApiRuntime(env).createChatReplyStream(
    await readJson(request),
  );
  const headers = new Headers(corsHeaders(request, env));
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');
  headers.set('X-Accel-Buffering', 'no');
  headers.set('X-Cache', streamResult.cacheStatus);

  return new Response(createAssistantSseStream(streamResult.events), {
    headers,
  });
};

const handleTextToSpeech = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const speech = await createWorkerApiRuntime(env).createTextToSpeech(
    await readJson(request),
  );

  const headers = new Headers(corsHeaders(request, env));
  headers.set('Content-Type', speech.contentType);
  headers.set('Cache-Control', speech.cacheControl);
  return new Response(speech.audio, { headers });
};

const handleSpeechToText = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const audioBuffer = await request.arrayBuffer();
  const contentType = request.headers.get('Content-Type');
  const text = await createWorkerApiRuntime(env).createSpeechToText({
    contentType: contentType === null ? '' : contentType,
    audio: audioBuffer,
  });
  return jsonResponse(request, env, { success: true, text });
};

const handleSendEmail = async (
  request: Request,
  env: Env,
): Promise<Response> =>
  jsonResponse(
    request,
    env,
    await createWorkerApiRuntime(env).sendPortfolioEmail(
      await readJson(request),
    ),
  );

const createWorkerApiRuntime = (env: Env) =>
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

const readJson = async (request: Request): Promise<Record<string, unknown>> => {
  try {
    const body = await request.json();
    if (!isRecord(body)) {
      throw new CoreHttpError('Invalid request body', 400);
    }
    return body;
  } catch (error) {
    if (error instanceof CoreHttpError) {
      throw error;
    }
    throw new CoreHttpError('Invalid JSON body', 400);
  }
};

const jsonResponse = (
  request: Request,
  env: Env,
  body: unknown,
  status = 200,
): Response => {
  const headers = new Headers(corsHeaders(request, env));
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(body), { status, headers });
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

const isAllowedOrigin = (origin: string, env: Env): boolean => {
  const frontendUrl = env.FRONTEND_URL === undefined ? '' : env.FRONTEND_URL;
  const allowed = new Set(
    // Raw row example: "https://a.test,https://b.test" splits into allowed origins.
    frontendUrl
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );

  try {
    const url = new URL(origin);
    return (
      allowed.has(origin) ||
      url.hostname === 'localhost' ||
      url.hostname.endsWith('.workers.dev')
    );
  } catch {
    return false;
  }
};

const isApiPath = (pathname: string): boolean =>
  pathname === '/health' || pathname.startsWith('/api/');

const fetchStaticProductPage = (
  request: Request,
  env: Env,
  staticFile: string,
): Promise<Response> => {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = `/${staticFile}`;
  return env.ASSETS.fetch(
    new Request(assetUrl.toString(), {
      headers: request.headers,
      method: request.method,
    }),
  );
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
    const clientIp =
      firstForwardedIp === undefined ? '' : firstForwardedIp.trim();
    return clientIp.length > 0 ? clientIp : 'unknown';
  }

  return 'unknown';
};
