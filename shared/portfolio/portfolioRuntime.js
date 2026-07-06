import { Schema } from 'effect';
import {
  ASSISTANT_STREAM_DONE_EVENT,
  encodeAssistantSseEvent,
} from './assistantStream.js';
import {
  CONTACT_RECIPIENT_DEFAULT,
  createPortfolioEmail,
} from './contactEmail.js';
import { getDynamicGitHubProjectsContext } from './githubPortfolio.js';
import { createPortfolioSystemPromptBase } from './portfolioKnowledge.js';

export const CoreHttpError = class CoreHttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
};

export const DEFAULT_SPEECH_LANGUAGE = 'en';
export const TEXT_TO_SPEECH_CACHE_CONTROL = 'private, max-age=3600';

export const AI_CHAT_MODEL = 'gpt-4o-mini';
export const AI_CHAT_MAX_TOKENS = 400;
export const AI_CHAT_TEMPERATURE = 0.7;

const BASE_SYSTEM_PROMPT = createPortfolioSystemPromptBase();
// Raw row example: "latest github projects" should match the dynamic portfolio intent regex.
const DYNAMIC_PORTFOLIO_INTENT_PATTERN =
  /\b(github|repo|repos|project|projects|recent|latest|newest|updated)\b/i;

// Raw row example: "joseph@example.com" should match the email boundary regex.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Raw row example: "audio/webm" should match the audio content type boundary regex.
const AUDIO_CONTENT_TYPE_PATTERN = /audio\//;

const boundedText = (min, max) =>
  Schema.Trim.pipe(Schema.minLength(min), Schema.maxLength(max));

const ChatMessageSchema = Schema.Struct({
  role: Schema.Literal('user', 'assistant'),
  content: boundedText(1, 2000),
});

const ChatRequestBodySchema = Schema.Struct({
  messages: Schema.Array(ChatMessageSchema).pipe(Schema.minItems(1)),
});

const TextToSpeechVoiceSchema = Schema.Literal(
  'alloy',
  'echo',
  'fable',
  'onyx',
  'nova',
  'shimmer',
);

const TextToSpeechInputSchema = Schema.Struct({
  text: boundedText(1, 4096),
  voice: Schema.optionalWith(TextToSpeechVoiceSchema, {
    default: () => 'nova',
  }),
});

const PortfolioEmailInputSchema = Schema.Struct({
  senderName: boundedText(1, 100),
  senderEmail: boundedText(3, 254).pipe(Schema.pattern(EMAIL_PATTERN)),
  subject: boundedText(1, 200),
  message: boundedText(10, 5000),
});

const AudioContentTypeSchema = Schema.String.pipe(
  Schema.pattern(AUDIO_CONTENT_TYPE_PATTERN),
);

/**
 * Decodes an API boundary payload with Effect Schema.
 *
 * @param schema - Effect Schema used for the boundary.
 * @param value - Unknown request payload.
 * @param message - HTTP error message returned when decoding fails.
 * @returns Decoded and normalized value.
 * @example
 * decodeBoundary(ChatRequestBodySchema, { messages: [{ role: 'user', content: ' hi ' }] }, 'Invalid request body')
 */
const decodeBoundary = (schema, value, message) => {
  try {
    return Schema.decodeUnknownSync(schema)(value);
  } catch {
    throw new CoreHttpError(message, 400);
  }
};

/**
 * Parses and trims a chat request body.
 *
 * @param body - Unknown request body.
 * @returns Chat messages accepted by the assistant core.
 * @example
 * parseChatRequestBody({ messages: [{ role: 'user', content: ' hello ' }] })
 */
export const parseChatRequestBody = (body) =>
  decodeBoundary(ChatRequestBodySchema, body, 'Invalid request body');

/**
 * Parses and trims a text-to-speech request body.
 *
 * @param body - Unknown request body.
 * @returns Text-to-speech input with the default voice applied.
 * @example
 * parseTextToSpeechRequestBody({ text: 'Hello' })
 */
export const parseTextToSpeechRequestBody = (body) =>
  decodeBoundary(TextToSpeechInputSchema, body, 'Invalid request body');

/**
 * Parses and trims a portfolio email request body.
 *
 * @param body - Unknown request body.
 * @returns Validated portfolio email input.
 * @example
 * parsePortfolioEmailInput({ senderName: 'Joseph', senderEmail: 'joseph@example.com', subject: 'Hi', message: 'Long enough message.' })
 */
export const parsePortfolioEmailInput = (body) =>
  decodeBoundary(PortfolioEmailInputSchema, body, 'Invalid request body');

/**
 * Requires an audio request content type for speech-to-text input.
 *
 * @param contentType - Request content-type header value.
 * @returns The accepted content type.
 * @example
 * requireAudioContentType('audio/webm')
 */
export const requireAudioContentType = (contentType) =>
  decodeBoundary(
    AudioContentTypeSchema,
    contentType,
    'Invalid content type. Expected audio file.',
  );

/**
 * Checks whether an unknown value is a plain object record.
 *
 * @param value - Unknown value from a runtime boundary.
 * @returns True when the value is an object record.
 * @example
 * isRecord({ ok: true }) // true
 */
export const isRecord = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const getSystemPrompt = async () => {
  const githubContext = await getDynamicGitHubProjectsContext();
  return `${BASE_SYSTEM_PROMPT}\n\n${githubContext}`;
};

export const getLastUserMessage = (messages) => {
  const lastMessage = messages.at(-1);

  if (lastMessage === undefined) return '';

  return lastMessage.content;
};

export const hasDynamicPortfolioIntent = (message) =>
  DYNAMIC_PORTFOLIO_INTENT_PATTERN.test(message);

export const shouldBypassAssistantCache = (messages) =>
  hasDynamicPortfolioIntent(getLastUserMessage(messages));

export const canUseAssistantResponseCache = (messages) =>
  messages.length === 1 && !shouldBypassAssistantCache(messages);

export const createCachedResponseChunks = (response) => {
  // Raw row example: "one two three four" splits into ["one", "two", "three", "four"].
  const words = response.split(' ');
  const chunks = [];

  for (let index = 0; index < words.length; index += 3) {
    const hasMoreWords = index + 3 < words.length;
    chunks.push(
      words.slice(index, index + 3).join(' ') + (hasMoreWords ? ' ' : ''),
    );
  }

  return chunks;
};

const CACHE_TTL = 1000 * 60 * 60;
const MAX_CACHE_SIZE = 100;
// Raw row example: "Hello, world!" becomes "Hello world" before whitespace normalization.
const NON_WORD_OR_SPACE_PATTERN = /[^\w\s]/g;
// Raw row example: "hello   world" becomes "hello world".
const REPEATED_SPACE_PATTERN = /\s+/g;
// Raw row example: "tell me about your portfolio" should match /portfolio/.
const CACHEABLE_MESSAGE_PATTERNS = [
  /skill/,
  /tech/,
  /proficien/,
  /stack/,
  /language/,
  /project/,
  /built/,
  /portfolio/,
  /work.*on/,
  /experience/,
  /background/,
  /career/,
  /job/,
  /who.*is/,
  /tell.*about/,
  /introduce/,
  /education/,
  /degree/,
  /study/,
  /bootcamp/,
  /contact/,
  /reach/,
  /hire/,
];

const generateResponseCacheKey = (message) =>
  message
    .toLowerCase()
    .trim()
    .replace(NON_WORD_OR_SPACE_PATTERN, '')
    .replace(REPEATED_SPACE_PATTERN, ' ');

const isCacheableMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  return CACHEABLE_MESSAGE_PATTERNS.some((pattern) => pattern.test(lowerMessage));
};

export const createResponseCache = () => {
  const cache = new Map();

  return {
    get: (message) => {
      if (!isCacheableMessage(message)) {
        return null;
      }

      const key = generateResponseCacheKey(message);
      const entry = cache.get(key);
      if (!entry) {
        return null;
      }

      if (Date.now() - entry.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
      }

      return entry.response;
    },
    set: (message, response) => {
      if (!isCacheableMessage(message)) {
        return;
      }

      if (cache.size >= MAX_CACHE_SIZE) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey) {
          cache.delete(oldestKey);
        }
      }

      cache.set(generateResponseCacheKey(message), {
        response,
        timestamp: Date.now(),
      });
    },
    cleanup: () => {
      const now = Date.now();
      for (const [key, entry] of cache.entries()) {
        if (now - entry.timestamp > CACHE_TTL) {
          cache.delete(key);
        }
      }
    },
    getStats: () => ({
      size: cache.size,
      maxSize: MAX_CACHE_SIZE,
    }),
  };
};

export const responseCache = createResponseCache();

export const createAssistantReply = async ({
  messages,
  complete,
  cache = responseCache,
}) => {
  const lastUserMessage = getLastUserMessage(messages);

  if (canUseAssistantResponseCache(messages)) {
    const cached = cache.get(lastUserMessage);
    if (cached) {
      return { message: cached, cacheStatus: 'HIT' };
    }
  }

  const message = await complete(await createProviderInput(messages));
  if (!message) {
    throw new CoreHttpError('No response from AI', 500);
  }

  if (canUseAssistantResponseCache(messages)) {
    cache.set(lastUserMessage, message);
  }

  return { message, cacheStatus: 'MISS' };
};

export const createAssistantReplyStream = async ({
  messages,
  stream,
  cache = responseCache,
}) => {
  const lastUserMessage = getLastUserMessage(messages);

  if (canUseAssistantResponseCache(messages)) {
    const cached = cache.get(lastUserMessage);
    if (cached) {
      return {
        cacheStatus: 'HIT',
        events: createCachedAssistantReplyStream(cached),
      };
    }
  }

  return {
    cacheStatus: 'MISS',
    events: createLiveAssistantReplyStream({
      cache,
      cacheKey: canUseAssistantResponseCache(messages) ? lastUserMessage : null,
      input: await createProviderInput(messages),
      stream,
    }),
  };
};

export const createAssistantSseStream = (events) => {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start: async (controller) => {
      try {
        for await (const event of events) {
          controller.enqueue(encoder.encode(encodeAssistantSseEvent(event)));
        }
        controller.enqueue(encoder.encode(ASSISTANT_STREAM_DONE_EVENT));
      } catch {
        controller.enqueue(
          encoder.encode(
            encodeAssistantSseEvent({
              type: 'error',
              error: 'AI provider unavailable',
            }),
          ),
        );
        controller.enqueue(encoder.encode(ASSISTANT_STREAM_DONE_EVENT));
      } finally {
        controller.close();
      }
    },
  });
};

export const readOpenAiCompletionText = (completion) => {
  if (!(isRecord(completion) && Array.isArray(completion.choices))) {
    return '';
  }

  const [firstChoice] = completion.choices;
  if (!(isRecord(firstChoice) && isRecord(firstChoice.message))) {
    return '';
  }

  const content = firstChoice.message.content;
  return typeof content === 'string' ? content : '';
};

export const readOpenAiTextStream = (body) => ({
  [Symbol.asyncIterator]: async function* () {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      // Raw row example: "data: {\"choices\":[]}\n\ndata: [DONE]\n\n" splits into SSE lines.
      const lines = buffer.split('\n');
      const nextBuffer = lines.pop();
      buffer = nextBuffer === undefined ? '' : nextBuffer;

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) {
          continue;
        }

        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          return;
        }

        const parsed = parseJson(data);
        if (!(isRecord(parsed) && Array.isArray(parsed.choices))) {
          continue;
        }

        const [choice] = parsed.choices;
        if (!(isRecord(choice) && isRecord(choice.delta))) {
          continue;
        }

        const content = choice.delta.content;

        if (typeof content === 'string' && content.length > 0) {
          yield content;
        }
      }
    }
  },
});

const createProviderInput = async (messages) => ({
  model: AI_CHAT_MODEL,
  messages: [{ role: 'system', content: await getSystemPrompt() }, ...messages],
  maxTokens: AI_CHAT_MAX_TOKENS,
  temperature: AI_CHAT_TEMPERATURE,
});

const createCachedAssistantReplyStream = (response) => ({
  [Symbol.asyncIterator]: async function* () {
    for (const chunk of createCachedResponseChunks(response)) {
      yield { type: 'content', content: chunk };
    }
  },
});

const createLiveAssistantReplyStream = ({ cache, cacheKey, input, stream }) => ({
  [Symbol.asyncIterator]: async function* () {
    let fullResponse = '';

    try {
      for await (const content of await stream(input)) {
        fullResponse += content;
        yield { type: 'content', content };
      }

      if (cacheKey && fullResponse) {
        cache.set(cacheKey, fullResponse);
      }
    } catch {
      yield { type: 'error', error: 'AI provider unavailable' };
    }
  },
});

export const RATE_ENTRY_MAX_AGE_MS = 30 * 60 * 1000;

export const RATE_LIMIT_PRESETS = {
  chat: {
    windowMs: 60 * 1000,
    maxRequests: 20,
    burstWindowMs: 10 * 1000,
    maxBurst: 5,
    blockDurationMs: 5 * 60 * 1000,
    maxViolations: 3,
    permanentBlockAfterViolations: 5,
  },
  voice: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    burstWindowMs: 10 * 1000,
    maxBurst: 3,
    blockDurationMs: 10 * 60 * 1000,
    maxViolations: 3,
    permanentBlockAfterViolations: 5,
  },
  emailServer: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    burstWindowMs: 30 * 1000,
    maxBurst: 5,
    blockDurationMs: 60 * 1000,
    maxViolations: 5,
    permanentBlockAfterViolations: 5,
  },
  emailWorker: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    burstWindowMs: 30 * 1000,
    maxBurst: 5,
    permanentBlockAfterViolations: 10,
    blockDurationMs: 60 * 1000,
    maxViolations: 5,
  },
};

export const createRateLimitEntry = (now) => ({
  count: 0,
  windowStart: now,
  burstCount: 0,
  burstWindowStart: now,
  blockedUntil: 0,
  violations: 0,
});

export const consumeRateLimit = (
  store,
  key,
  options,
  now = Date.now(),
) => {
  let entry = store.get(key);
  if (!entry) {
    entry = createRateLimitEntry(now);
    store.set(key, entry);
  }

  if (entry.violations >= options.permanentBlockAfterViolations) {
    return {
      allowed: false,
      status: 403,
      body: {
        success: false,
        error: 'Access denied. You have been permanently blocked due to repeated abuse.',
        blocked: true,
        permanent: true,
      },
    };
  }

  if (now < entry.blockedUntil) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      allowed: false,
      status: 429,
      body: {
        success: false,
        error: `You are temporarily blocked. Try again in ${retryAfter} seconds.`,
        blocked: true,
        retryAfter,
      },
    };
  }

  if (now - entry.windowStart > options.windowMs) {
    entry.count = 0;
    entry.windowStart = now;
  }

  if (now - entry.burstWindowStart > options.burstWindowMs) {
    entry.burstCount = 0;
    entry.burstWindowStart = now;
  }

  entry.count += 1;
  entry.burstCount += 1;

  if (entry.count > options.maxRequests || entry.burstCount > options.maxBurst) {
    entry.violations += 1;
    const blockDuration = options.blockDurationMs * Math.min(entry.violations, 5);
    entry.blockedUntil = now + blockDuration;
    const retryAfter = Math.ceil(blockDuration / 1000);

    return {
      allowed: false,
      status: 429,
      body: {
        success: false,
        error: `Too many requests. You have been blocked for ${retryAfter} seconds.`,
        blocked: true,
        retryAfter,
        violations: entry.violations,
      },
    };
  }

  return {
    allowed: true,
    headers: {
      'X-RateLimit-Limit': String(options.maxRequests),
      'X-RateLimit-Remaining': String(
        Math.max(0, options.maxRequests - entry.count),
      ),
      'X-RateLimit-Reset': String(
        Math.ceil((entry.windowStart + options.windowMs) / 1000),
      ),
    },
  };
};

export const cleanupRateLimitStore = (store, now = Date.now()) => {
  for (const [key, entry] of store.entries()) {
    if (
      now - entry.windowStart > RATE_ENTRY_MAX_AGE_MS &&
      now >= entry.blockedUntil
    ) {
      store.delete(key);
    }
  }
};

export const PORTFOLIO_API_ROUTES = {
  chatHealth: { method: 'GET', path: '/api/chat/health' },
  emailHealth: { method: 'GET', path: '/api/email/health' },
  chat: { method: 'POST', path: '/api/chat' },
  chatStream: { method: 'POST', path: '/api/chat/stream' },
  textToSpeech: { method: 'POST', path: '/api/chat/tts' },
  speechToText: { method: 'POST', path: '/api/chat/stt' },
  sendEmail: { method: 'POST', path: '/api/email/send' },
};

export const createPortfolioApiRuntime = ({
  assistantProvider,
  emailDelivery,
  contactRecipient = CONTACT_RECIPIENT_DEFAULT,
}) => ({
  getChatHealth: () => ({
    cache: responseCache.getStats(),
  }),
  getEmailHealth: () => ({
    configured: Boolean(emailDelivery?.isConfigured()),
  }),
  createChatReply: async (body) => {
    const provider = requireAssistantProvider(assistantProvider);
    const { messages } = parseChatRequestBody(body);
    return createAssistantReply({
      messages,
      complete: provider.complete,
    });
  },
  createChatReplyStream: async (body) => {
    const provider = requireAssistantProvider(assistantProvider);
    const { messages } = parseChatRequestBody(body);
    return createAssistantReplyStream({
      messages,
      stream: provider.stream,
    });
  },
  createTextToSpeech: async (body) => {
    const provider = requireAssistantProvider(assistantProvider);
    const input = parseTextToSpeechRequestBody(body);
    return provider.textToSpeech(input);
  },
  createSpeechToText: async ({ contentType, audio }) => {
    const provider = requireAssistantProvider(assistantProvider);
    const validatedContentType = requireAudioContentType(contentType);
    if (audio.byteLength === 0) {
      throw new CoreHttpError('No audio data received', 400);
    }

    return provider.speechToText({
      file: new File([toArrayBuffer(audio)], 'audio.webm', {
        type: validatedContentType,
      }),
    });
  },
  sendPortfolioEmail: async (body) => {
    if (!emailDelivery?.isConfigured()) {
      throw new CoreHttpError('Email service is not configured', 503);
    }

    const emailInput = parsePortfolioEmailInput(body);
    const email = createPortfolioEmail(emailInput);
    await emailDelivery.send({
      emailInput,
      email,
      recipient: contactRecipient,
    });

    return { success: true, message: 'Email sent successfully' };
  },
});

const toArrayBuffer = (audio) => {
  const buffer = new ArrayBuffer(audio.byteLength);
  const bytes = new Uint8Array(buffer);
  const source =
    audio instanceof ArrayBuffer
      ? new Uint8Array(audio)
      : new Uint8Array(audio.buffer, audio.byteOffset, audio.byteLength);
  bytes.set(source);
  return buffer;
};

const requireAssistantProvider = (assistantProvider) => {
  if (!assistantProvider) {
    throw new CoreHttpError('AI provider is not configured', 503);
  }

  return assistantProvider;
};

const parseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};
