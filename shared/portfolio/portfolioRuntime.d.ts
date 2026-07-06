import type { AssistantStreamEvent } from './assistantStream.js';
import type {
  ContactEmailInput,
  ContactEmailMessageOutput,
} from './contactEmail.js';

export declare class CoreHttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number);
}

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type TextToSpeechVoice =
  | 'alloy'
  | 'echo'
  | 'fable'
  | 'onyx'
  | 'nova'
  | 'shimmer';

export type TextToSpeechInput = {
  text: string;
  voice: TextToSpeechVoice;
};

export type SpeechToTextInput = {
  file: File;
  language?: string;
};

export type TextToSpeechOutput = {
  audio: ArrayBuffer;
  contentType: 'audio/mpeg';
  cacheControl: string;
};

export type AssistantProviderMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type AssistantProviderInput = {
  model: string;
  messages: AssistantProviderMessage[];
  maxTokens: number;
  temperature: number;
};

export type CompleteAssistantResponse = (
  input: AssistantProviderInput,
) => Promise<string>;

export type StreamAssistantResponse = (
  input: AssistantProviderInput,
) => Promise<AsyncIterable<string>> | AsyncIterable<string>;

export type PortfolioAssistantProvider = {
  complete: CompleteAssistantResponse;
  stream: StreamAssistantResponse;
  textToSpeech: (input: TextToSpeechInput) => Promise<TextToSpeechOutput>;
  speechToText: (input: SpeechToTextInput) => Promise<string>;
};

export type AssistantCache = {
  get: (message: string) => string | null;
  set: (message: string, response: string) => void;
  cleanup: () => void;
  getStats: () => { size: number; maxSize: number };
};

export type AssistantCacheStatus = 'HIT' | 'MISS';

export type AssistantReply = {
  message: string;
  cacheStatus: AssistantCacheStatus;
};

export type AssistantStreamResult = {
  cacheStatus: AssistantCacheStatus;
  events: AsyncIterable<AssistantStreamEvent>;
};

export type RateLimitEntry = {
  count: number;
  windowStart: number;
  burstCount: number;
  burstWindowStart: number;
  blockedUntil: number;
  violations: number;
};

export type RateLimiterOptions = {
  windowMs: number;
  maxRequests: number;
  burstWindowMs: number;
  maxBurst: number;
  blockDurationMs: number;
  maxViolations?: number;
  permanentBlockAfterViolations: number;
};

export type RateLimitResult =
  | {
      allowed: true;
      headers: Record<string, string>;
    }
  | {
      allowed: false;
      status: 403 | 429;
      body: Record<string, unknown>;
    };

export type PortfolioRoute = {
  method: 'GET' | 'POST';
  path: string;
};

export type PortfolioEmailMessage = ContactEmailMessageOutput;

export type PortfolioEmailDelivery = {
  isConfigured: () => boolean;
  send: (input: {
    emailInput: ContactEmailInput;
    email: PortfolioEmailMessage;
    recipient: string;
  }) => Promise<void>;
};

export type PortfolioApiRuntime = {
  getChatHealth: () => Record<string, unknown>;
  getEmailHealth: () => Record<string, unknown>;
  createChatReply: (body: unknown) => Promise<AssistantReply>;
  createChatReplyStream: (body: unknown) => Promise<AssistantStreamResult>;
  createTextToSpeech: (body: unknown) => Promise<TextToSpeechOutput>;
  createSpeechToText: (input: {
    contentType: string;
    audio: ArrayBuffer | ArrayBufferView;
  }) => Promise<string>;
  sendPortfolioEmail: (
    body: unknown,
  ) => Promise<{ success: true; message: string }>;
};

export declare const DEFAULT_SPEECH_LANGUAGE = 'en';
export declare const TEXT_TO_SPEECH_CACHE_CONTROL = 'private, max-age=3600';
export declare const AI_CHAT_MODEL = 'gpt-4o-mini';
export declare const AI_CHAT_MAX_TOKENS = 400;
export declare const AI_CHAT_TEMPERATURE = 0.7;
export declare const RATE_ENTRY_MAX_AGE_MS: number;
export declare const RATE_LIMIT_PRESETS: Record<string, RateLimiterOptions>;
export declare const PORTFOLIO_API_ROUTES: Record<string, PortfolioRoute>;
export declare const responseCache: AssistantCache;

/**
 * Parses and trims a chat request body.
 *
 * @param body - Unknown request body.
 * @returns Chat messages accepted by the assistant core.
 * @example
 * parseChatRequestBody({ messages: [{ role: 'user', content: ' hello ' }] })
 */
export declare const parseChatRequestBody: (
  body: unknown,
) => { messages: ChatMessage[] };

/**
 * Parses and trims a text-to-speech request body.
 *
 * @param body - Unknown request body.
 * @returns Text-to-speech input with the default voice applied.
 * @example
 * parseTextToSpeechRequestBody({ text: 'Hello' })
 */
export declare const parseTextToSpeechRequestBody: (
  body: unknown,
) => TextToSpeechInput;

/**
 * Parses and trims a portfolio email request body.
 *
 * @param body - Unknown request body.
 * @returns Validated portfolio email input.
 * @example
 * parsePortfolioEmailInput({ senderName: 'Joseph', senderEmail: 'joseph@example.com', subject: 'Hi', message: 'Long enough message.' })
 */
export declare const parsePortfolioEmailInput: (
  body: unknown,
) => ContactEmailInput;

/**
 * Requires an audio request content type for speech-to-text input.
 *
 * @param contentType - Request content-type header value.
 * @returns The accepted content type.
 * @example
 * requireAudioContentType('audio/webm')
 */
export declare const requireAudioContentType: (
  contentType: string,
) => string;

/**
 * Checks whether an unknown value is a plain object record.
 *
 * @param value - Unknown value from a runtime boundary.
 * @returns True when the value is an object record.
 * @example
 * isRecord({ ok: true }) // true
 */
export declare const isRecord: (
  value: unknown,
) => value is Record<string, unknown>;

export declare const getSystemPrompt: () => Promise<string>;
export declare const getLastUserMessage: (messages: ChatMessage[]) => string;
export declare const hasDynamicPortfolioIntent: (message: string) => boolean;
export declare const shouldBypassAssistantCache: (
  messages: ChatMessage[],
) => boolean;
export declare const canUseAssistantResponseCache: (
  messages: ChatMessage[],
) => boolean;
export declare const createCachedResponseChunks: (
  response: string,
) => string[];
export declare const createResponseCache: () => AssistantCache;
export declare const createAssistantReply: (input: {
  messages: ChatMessage[];
  complete: CompleteAssistantResponse;
  cache?: AssistantCache;
}) => Promise<AssistantReply>;
export declare const createAssistantReplyStream: (input: {
  messages: ChatMessage[];
  stream: StreamAssistantResponse;
  cache?: AssistantCache;
}) => Promise<AssistantStreamResult>;
export declare const createAssistantSseStream: (
  events: AsyncIterable<AssistantStreamEvent>,
) => ReadableStream<Uint8Array>;
export declare const readOpenAiCompletionText: (completion: unknown) => string;
export declare const readOpenAiTextStream: (
  body: ReadableStream<Uint8Array>,
) => AsyncIterable<string>;
export declare const createRateLimitEntry: (
  now: number,
) => RateLimitEntry;
export declare const consumeRateLimit: (
  store: Map<string, RateLimitEntry>,
  key: string,
  options: RateLimiterOptions,
  now?: number,
) => RateLimitResult;
export declare const cleanupRateLimitStore: (
  store: Map<string, RateLimitEntry>,
  now?: number,
) => void;
export declare const createPortfolioApiRuntime: (input: {
  assistantProvider?: PortfolioAssistantProvider;
  emailDelivery?: PortfolioEmailDelivery;
  contactRecipient?: string;
}) => PortfolioApiRuntime;
