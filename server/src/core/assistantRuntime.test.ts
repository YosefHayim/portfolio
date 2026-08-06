import {
  createAssistantStreamParser,
  encodeAssistantSseEvent,
} from '@shared/portfolio/assistantStream.js';
import { describe, expect, it } from '@effect/vitest';
import type { ChatMessage } from './assistant.js';
import {
  type AssistantCache,
  type AssistantStreamEvent,
  createAssistantReply,
  createAssistantReplyStream,
  createAssistantSseStream,
  readOpenAiCompletionText,
  readOpenAiTextStream,
} from './assistantRuntime.js';
import { HTTP_ERROR_MESSAGE } from './httpErrors.js';

const createMapCache = (seed: Record<string, string> = {}): AssistantCache => {
  const values = new Map(Object.entries(seed));
  return {
    get: (message) => {
      const value = values.get(message);
      return value === undefined ? null : value;
    },
    set: (message, reply) => {
      values.set(message, reply);
    },
  };
};

const withMockedGitHubFetch = async (run: () => Promise<void>): Promise<void> => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify([]), { status: 200 })) as typeof fetch;

  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
};

const collectStreamEvents = async (
  events: AsyncIterable<AssistantStreamEvent>,
): Promise<AssistantStreamEvent[]> => {
  const collected: AssistantStreamEvent[] = [];
  for await (const event of events) {
    collected.push(event);
  }
  return collected;
};

const readSseStreamText = async (stream: ReadableStream<Uint8Array>): Promise<string> => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let shouldRead = true;

  while (shouldRead) {
    const { value, done } = await reader.read();
    if (done) {
      shouldRead = false;
    } else {
      text += decoder.decode(value, { stream: true });
    }
  }

  return text;
};

describe('createAssistantReply', () => {
  it('throws plain Error when the provider returns an empty message', async () => {
    await withMockedGitHubFetch(async () => {
      await expect(
        createAssistantReply({
          messages: [{ role: 'user', content: 'What are your skills?' }],
          cache: createMapCache(),
          complete: async () => '',
        }),
      ).rejects.toThrow(HTTP_ERROR_MESSAGE.noAiResponse);
    });
  });

  it('does not write multi-turn replies into the cache', async () => {
    await withMockedGitHubFetch(async () => {
      const cache = createMapCache();
      const messages: ChatMessage[] = [
        { role: 'user', content: 'skills?' },
        { role: 'assistant', content: 'TS' },
        { role: 'user', content: 'and react?' },
      ];

      const reply = await createAssistantReply({
        messages,
        cache,
        complete: async () => 'React too',
      });

      expect(reply.cacheStatus).toBe('MISS');
      expect(cache.get('and react?')).toBeNull();
    });
  });
});

describe('createAssistantReplyStream', () => {
  it('replays cached content in word chunks on HIT', async () => {
    await withMockedGitHubFetch(async () => {
      const cache = createMapCache({
        'What are Joseph skills': 'one two three four',
      });

      const streamResult = await createAssistantReplyStream({
        messages: [{ role: 'user', content: 'What are Joseph skills' }],
        cache,
        stream: async function* () {
          yield 'should not run';
        },
      });

      expect(streamResult.cacheStatus).toBe('HIT');
      expect(await collectStreamEvents(streamResult.events)).toEqual([
        { type: 'content', content: 'one two three ' },
        { type: 'content', content: 'four' },
      ]);
    });
  });

  it('streams live chunks, caches full text, and surfaces provider errors', async () => {
    await withMockedGitHubFetch(async () => {
      const cache = createMapCache();
      let streamCalls = 0;

      const live = await createAssistantReplyStream({
        messages: [{ role: 'user', content: 'Tell me about your background' }],
        cache,
        stream: async function* () {
          streamCalls += 1;
          yield 'Hello ';
          yield 'world';
        },
      });

      expect(live.cacheStatus).toBe('MISS');
      expect(await collectStreamEvents(live.events)).toEqual([
        { type: 'content', content: 'Hello ' },
        { type: 'content', content: 'world' },
      ]);
      expect(streamCalls).toBe(1);
      expect(cache.get('Tell me about your background')).toBe('Hello world');

      const failing = await createAssistantReplyStream({
        messages: [{ role: 'user', content: 'Introduce yourself please' }],
        cache,
        stream: async function* () {
          throw new Error('provider down');
        },
      });

      expect(await collectStreamEvents(failing.events)).toEqual([
        { type: 'error', error: 'AI provider unavailable' },
      ]);
    });
  });
});

describe('createAssistantSseStream', () => {
  it('encodes content events and terminates with [DONE]', async () => {
    async function* events(): AsyncGenerator<AssistantStreamEvent> {
      yield { type: 'content', content: 'hi' };
      yield { type: 'content', content: ' there' };
    }

    const text = await readSseStreamText(createAssistantSseStream(events()));
    const parser = createAssistantStreamParser();
    const parsed = parser.push(text);

    expect(parsed.events).toEqual([
      { type: 'content', content: 'hi' },
      { type: 'content', content: ' there' },
    ]);
    expect(parsed.done).toBe(true);
    expect(text).toContain(encodeAssistantSseEvent({ type: 'content', content: 'hi' }));
    expect(text.endsWith('data: [DONE]\n\n') || text.includes('data: [DONE]\n\n')).toBe(true);
  });

  it('emits a provider error event when the event source throws', async () => {
    async function* broken(): AsyncGenerator<AssistantStreamEvent> {
      yield { type: 'content', content: 'partial' };
      throw new Error('boom');
    }

    const text = await readSseStreamText(createAssistantSseStream(broken()));
    const parser = createAssistantStreamParser();
    const parsed = parser.push(text);

    expect(parsed.events).toEqual([
      { type: 'content', content: 'partial' },
      { type: 'error', error: 'AI provider unavailable' },
    ]);
    expect(parsed.done).toBe(true);
  });
});

describe('readOpenAiCompletionText', () => {
  it('reads string content from the first choice message', () => {
    expect(
      readOpenAiCompletionText({
        choices: [{ message: { content: 'Hello from OpenAI' } }],
      }),
    ).toBe('Hello from OpenAI');
  });

  it('returns empty string for malformed completion shapes', () => {
    expect(readOpenAiCompletionText(null)).toBe('');
    expect(readOpenAiCompletionText({})).toBe('');
    expect(readOpenAiCompletionText({ choices: [] })).toBe('');
    expect(readOpenAiCompletionText({ choices: [{ message: { content: 42 } }] })).toBe('');
    expect(readOpenAiCompletionText({ choices: [{ message: null }] })).toBe('');
  });
});

describe('readOpenAiTextStream', () => {
  it('yields delta content across SSE chunks and stops at [DONE]', async () => {
    const sse = [
      'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"lo"}}]}\n\n',
      'data: [DONE]\n\n',
      'data: {"choices":[{"delta":{"content":"ignored"}}]}\n\n',
    ].join('');

    const body = new ReadableStream<Uint8Array>({
      start: (controller) => {
        // Split mid-event so the buffer reassembly path is exercised.
        const bytes = new TextEncoder().encode(sse);
        controller.enqueue(bytes.slice(0, 20));
        controller.enqueue(bytes.slice(20));
        controller.close();
      },
    });

    const chunks: string[] = [];
    for await (const chunk of readOpenAiTextStream(body)) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['Hel', 'lo']);
  });

  it('skips non-data lines and empty deltas', async () => {
    const sse = [
      ': keep-alive\n',
      'data: not-json\n',
      'data: {"choices":[]}\n',
      'data: {"choices":[{"delta":{}}]}\n',
      'data: {"choices":[{"delta":{"content":"ok"}}]}\n',
      'data: [DONE]\n\n',
    ].join('\n');

    const body = new ReadableStream<Uint8Array>({
      start: (controller) => {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });

    const chunks: string[] = [];
    for await (const chunk of readOpenAiTextStream(body)) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['ok']);
  });
});
