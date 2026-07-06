import type { ContactEmailInput } from '@shared/portfolio/contactEmail.js';
import { Schema } from 'effect';
import type { ChatMessage } from './assistant.js';

export class CoreHttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
  }
}

// Raw row example: "joseph@example.com" should match the email boundary regex.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Raw row example: "audio/webm" should match the audio content type boundary regex.
const AUDIO_CONTENT_TYPE_PATTERN = /audio\//;

const boundedText = (min: number, max: number) =>
  Schema.Trim.pipe(Schema.minLength(min), Schema.maxLength(max));

const ChatMessageSchema: Schema.Schema<ChatMessage> = Schema.Struct({
  role: Schema.Literal('user', 'assistant'),
  content: boundedText(1, 2000),
});

const ChatRequestBodySchema = Schema.Struct({
  messages: Schema.Array(ChatMessageSchema).pipe(Schema.minItems(1)),
});

export type TextToSpeechVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export type TextToSpeechInput = {
  readonly text: string;
  readonly voice: TextToSpeechVoice;
};

const TextToSpeechVoiceSchema: Schema.Schema<TextToSpeechVoice> = Schema.Literal(
  'alloy',
  'echo',
  'fable',
  'onyx',
  'nova',
  'shimmer',
);

const TextToSpeechInputSchema: Schema.Schema<
  TextToSpeechInput,
  { readonly text: string; readonly voice?: TextToSpeechVoice }
> = Schema.Struct({
  text: boundedText(1, 4096),
  voice: Schema.optionalWith(TextToSpeechVoiceSchema, { default: () => 'nova' }),
});

const PortfolioEmailInputSchema: Schema.Schema<ContactEmailInput> = Schema.Struct({
  senderName: boundedText(1, 100),
  senderEmail: boundedText(3, 254).pipe(Schema.pattern(EMAIL_PATTERN)),
  subject: boundedText(1, 200),
  message: boundedText(10, 5000),
});

const AudioContentTypeSchema = Schema.String.pipe(Schema.pattern(AUDIO_CONTENT_TYPE_PATTERN));

/**
 * Decodes an API boundary payload with Effect Schema.
 *
 * @param schema - Effect Schema used for the boundary.
 * @param value - Unknown request payload from Express.
 * @param message - HTTP error message returned when decoding fails.
 * @returns Decoded and normalized value.
 * @example
 * decodeBoundary(ChatRequestBodySchema, { messages: [{ role: 'user', content: ' hi ' }] }, 'Invalid request body')
 */
const decodeBoundary = <T, TEncoded>(
  schema: Schema.Schema<T, TEncoded, never>,
  value: unknown,
  message: string,
): T => {
  try {
    return Schema.decodeUnknownSync(schema)(value);
  } catch (error) {
    throw new CoreHttpError(message, 400, { cause: error });
  }
};

/**
 * Parses and trims a chat request body.
 *
 * @param body - Unknown Express request body.
 * @returns Chat messages accepted by the assistant core.
 * @example
 * parseChatRequestBody({ messages: [{ role: 'user', content: ' hello ' }] })
 */
export const parseChatRequestBody = (
  body: unknown,
): { readonly messages: readonly ChatMessage[] } =>
  decodeBoundary(ChatRequestBodySchema, body, 'Invalid request body');

/**
 * Parses and trims a text-to-speech request body.
 *
 * @param body - Unknown Express request body.
 * @returns Text-to-speech input with the default voice applied.
 * @example
 * parseTextToSpeechRequestBody({ text: 'Hello' })
 */
export const parseTextToSpeechRequestBody = (body: unknown): TextToSpeechInput =>
  decodeBoundary(TextToSpeechInputSchema, body, 'Invalid request body');

/**
 * Parses and trims a portfolio email request body.
 *
 * @param body - Unknown Express request body.
 * @returns Validated portfolio email input.
 * @example
 * parsePortfolioEmailInput({ senderName: 'Joseph', senderEmail: 'joseph@example.com', subject: 'Hi', message: 'Long enough message.' })
 */
export const parsePortfolioEmailInput = (body: unknown): ContactEmailInput =>
  decodeBoundary(PortfolioEmailInputSchema, body, 'Invalid request body');

/**
 * Requires an audio request content type for speech-to-text input.
 *
 * @param contentType - Request `content-type` header value.
 * @returns The accepted content type.
 * @example
 * requireAudioContentType('audio/webm')
 */
export const requireAudioContentType = (contentType: string): string =>
  decodeBoundary(AudioContentTypeSchema, contentType, 'Invalid content type. Expected audio file.');

/**
 * Checks whether an unknown value is a plain object record.
 *
 * @param value - Unknown value from a runtime boundary.
 * @returns True when the value is an object record.
 * @example
 * isRecord({ ok: true }) // true
 */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);
