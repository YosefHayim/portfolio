import {
  ASSISTANT_STREAM_DONE_EVENT,
  encodeAssistantSseEvent,
} from '@shared/portfolio/assistantStream.js';
import {
  AI_CHAT_MAX_TOKENS,
  AI_CHAT_MODEL,
  AI_CHAT_TEMPERATURE,
  type ChatMessage,
  canUseAssistantResponseCache,
  createCachedResponseChunks,
  getLastUserMessage,
  getSystemPrompt,
} from './assistant.js';
import { HTTP_ERROR_MESSAGE, throwHttpError } from './httpErrors.js';
import { isRecord } from './requestValidation.js';
import { responseCache as defaultResponseCache } from './responseCache.js';

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

export type CompleteAssistantResponse = (input: AssistantProviderInput) => Promise<string>;

export type StreamAssistantResponse = (
  input: AssistantProviderInput,
) => Promise<AsyncIterable<string>> | AsyncIterable<string>;

export type AssistantCache = {
  get: (message: string) => string | null;
  set: (message: string, replyText: string) => void;
};

export type AssistantCacheStatus = 'HIT' | 'MISS';

export type AssistantReply = {
  message: string;
  cacheStatus: AssistantCacheStatus;
};

export type AssistantStreamEvent =
  | { type: 'content'; content: string }
  | { type: 'error'; error: string };

export type AssistantReplyStream = {
  cacheStatus: AssistantCacheStatus;
  events: AsyncIterable<AssistantStreamEvent>;
};

export const createAssistantReply = async ({
  messages,
  complete,
  cache = defaultResponseCache,
}: {
  messages: readonly ChatMessage[];
  complete: CompleteAssistantResponse;
  cache?: AssistantCache;
}): Promise<AssistantReply> => {
  const lastUserMessage = getLastUserMessage(messages);

  if (canUseAssistantResponseCache(messages)) {
    const cached = cache.get(lastUserMessage);
    if (cached) {
      return { message: cached, cacheStatus: 'HIT' };
    }
  }

  const message = await complete(await createProviderInput(messages));
  if (!message) {
    return throwHttpError(HTTP_ERROR_MESSAGE.noAiResponse);
  }

  if (canUseAssistantResponseCache(messages)) {
    cache.set(lastUserMessage, message);
  }

  return { message, cacheStatus: 'MISS' };
};

export const createAssistantReplyStream = async ({
  messages,
  stream,
  cache = defaultResponseCache,
}: {
  messages: readonly ChatMessage[];
  stream: StreamAssistantResponse;
  cache?: AssistantCache;
}): Promise<AssistantReplyStream> => {
  const lastUserMessage = getLastUserMessage(messages);

  if (canUseAssistantResponseCache(messages)) {
    const cached = cache.get(lastUserMessage);
    if (cached) {
      return {
        cacheStatus: 'HIT',
        events: streamCachedAssistantReply(cached),
      };
    }
  }

  return {
    cacheStatus: 'MISS',
    events: streamLiveAssistantReply({
      cache,
      cacheKey: canUseAssistantResponseCache(messages) ? lastUserMessage : null,
      input: await createProviderInput(messages),
      stream,
    }),
  };
};

export const createAssistantSseStream = (
  events: AsyncIterable<AssistantStreamEvent>,
): ReadableStream<Uint8Array> => {
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

export const readOpenAiCompletionText = (completion: unknown): string => {
  if (!(isRecord(completion) && Array.isArray(completion.choices))) {
    return '';
  }

  const [firstChoice] = completion.choices;
  if (!(isRecord(firstChoice) && isRecord(firstChoice.message))) {
    return '';
  }

  const { content } = firstChoice.message;
  return typeof content === 'string' ? content : '';
};

export const readOpenAiTextStream = (
  byteStream: ReadableStream<Uint8Array>,
): AsyncIterable<string> => ({
  async *[Symbol.asyncIterator]() {
    const reader = byteStream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let shouldRead = true;

    while (shouldRead) {
      const { value, done } = await reader.read();
      if (done) {
        shouldRead = false;
      } else {
        buffer += decoder.decode(value, { stream: true });
        // Raw row example: "data: {\"choices\":[]}\n\ndata: [DONE]\n\n" splits into SSE lines.
        const lines = buffer.split('\n');
        const nextBuffer = lines.pop();
        buffer = nextBuffer === undefined ? '' : nextBuffer;

        for (const line of lines) {
          const content = readOpenAiTextStreamLine(line);
          if (content === OPENAI_STREAM_DONE) {
            return;
          }

          if (typeof content === 'string' && content.length > 0) {
            yield content;
          }
        }
      }
    }
  },
});

const OPENAI_STREAM_DONE = Symbol('OPENAI_STREAM_DONE');

const createProviderInput = async (
  messages: readonly ChatMessage[],
): Promise<AssistantProviderInput> => ({
  model: AI_CHAT_MODEL,
  messages: [{ role: 'system', content: await getSystemPrompt() }, ...messages],
  maxTokens: AI_CHAT_MAX_TOKENS,
  temperature: AI_CHAT_TEMPERATURE,
});

const streamCachedAssistantReply = (replyText: string): AsyncIterable<AssistantStreamEvent> => ({
  async *[Symbol.asyncIterator]() {
    for (const chunk of createCachedResponseChunks(replyText)) {
      yield { type: 'content', content: chunk };
    }
  },
});

const streamLiveAssistantReply = ({
  cache,
  cacheKey,
  input,
  stream,
}: {
  cache: AssistantCache;
  cacheKey: string | null;
  input: AssistantProviderInput;
  stream: StreamAssistantResponse;
}): AsyncIterable<AssistantStreamEvent> => ({
  async *[Symbol.asyncIterator]() {
    let fullReply = '';

    try {
      for await (const content of await stream(input)) {
        fullReply += content;
        yield { type: 'content', content };
      }

      if (cacheKey && fullReply) {
        cache.set(cacheKey, fullReply);
      }
    } catch {
      yield { type: 'error', error: 'AI provider unavailable' };
    }
  },
});

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const readOpenAiTextStreamLine = (line: string): string | null | typeof OPENAI_STREAM_DONE => {
  const trimmed = line.trim();
  if (!trimmed.startsWith('data: ')) {
    return null;
  }

  const ssePayload = trimmed.slice(6);
  if (ssePayload === '[DONE]') {
    return OPENAI_STREAM_DONE;
  }

  const parsed = parseJson(ssePayload);
  if (!(isRecord(parsed) && Array.isArray(parsed.choices))) {
    return null;
  }

  const [choice] = parsed.choices;
  if (!(isRecord(choice) && isRecord(choice.delta))) {
    return null;
  }

  const { content } = choice.delta;
  return typeof content === 'string' ? content : null;
};
