import { expect, it } from '@effect/vitest';
import {
  createAssistantStreamParser,
  encodeAssistantSseEvent,
} from '@shared/portfolio/assistantStream.js';
import {
  CONTACT_EMAIL_MARKER_EXAMPLE,
  createPortfolioEmail,
  parseContactEmailMarker,
  stripContactEmailMarker,
} from '@shared/portfolio/contactEmail.js';
import {
  createGitHubProjectPreviews,
  createGitHubStatsSnapshot,
  type GitHubRepo,
} from '@shared/portfolio/githubPortfolio.js';
import { createPortfolioSystemPromptBase } from '@shared/portfolio/portfolioKnowledge.js';
import { type AssistantCache, createAssistantReply } from './assistantRuntime.js';
import {
  CoreHttpError,
  parseChatRequestBody,
  parsePortfolioEmailInput,
} from './requestValidation.js';

const createMapCache = (seed: Record<string, string> = {}): AssistantCache => {
  const values = new Map(Object.entries(seed));
  return {
    get: (message) => {
      const value = values.get(message);
      return value === undefined ? null : value;
    },
    set: (message, response) => values.set(message, response),
  };
};

const createRepo = (overrides: Partial<GitHubRepo>): GitHubRepo => ({
  name: 'default',
  html_url: 'https://github.com/YosefHayim/default',
  description: 'Default repo',
  stargazers_count: 0,
  fork: false,
  archived: false,
  pushed_at: '2026-01-01T00:00:00Z',
  ...overrides,
});

const withMockedGitHubFetch = async (run: () => Promise<void>): Promise<void> => {
  const originalFetch = globalThis.fetch;
  const emptyGitHubFetch: typeof fetch = async () =>
    new Response(JSON.stringify([]), { status: 200 });
  globalThis.fetch = emptyGitHubFetch;

  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
};

it('request validation trims portfolio inputs and rejects invalid roles', () => {
  expect(parseChatRequestBody({ messages: [{ role: 'user', content: ' hello ' }] })).toEqual({
    messages: [{ role: 'user', content: 'hello' }],
  });

  expect(() =>
    parseChatRequestBody({
      messages: [{ role: 'system', content: 'hello' }],
    }),
  ).toThrow(CoreHttpError);

  expect(
    parsePortfolioEmailInput({
      senderName: ' Joseph ',
      senderEmail: ' joseph@example.com ',
      subject: ' Hello ',
      message: ' This is a long enough message. ',
    }),
  ).toEqual({
    senderName: 'Joseph',
    senderEmail: 'joseph@example.com',
    subject: 'Hello',
    message: 'This is a long enough message.',
  });
});

it('contact email marker is one shared interface from prompt to sender', () => {
  const emailData = parseContactEmailMarker(`Ready to send.\n${CONTACT_EMAIL_MARKER_EXAMPLE}`);

  expect(emailData).toEqual({
    senderName: 'Name',
    senderEmail: 'email@example.com',
    subject: 'Brief Subject',
    message: 'Message content',
  });
  expect(stripContactEmailMarker(`Visible ${CONTACT_EMAIL_MARKER_EXAMPLE}`)).toBe('Visible');

  const email = createPortfolioEmail({
    senderName: '<Joseph>',
    senderEmail: 'joseph@example.com',
    subject: 'Hello',
    message: 'This is a long enough message.',
  });
  expect(email.subject).toBe('[Portfolio] Hello');
  expect(email.html).toMatch(/&lt;Joseph&gt;/);
});

it('assistant stream parser preserves split event lines', () => {
  const parser = createAssistantStreamParser();
  const encoded = `${encodeAssistantSseEvent({ type: 'content', content: 'hel' })}${encodeAssistantSseEvent({ type: 'content', content: 'lo' })}data: [DONE]\n\n`;

  const first = parser.push(encoded.slice(0, 15));
  const second = parser.push(encoded.slice(15));

  expect(first.events).toEqual([]);
  expect(second.events).toEqual([
    { type: 'content', content: 'hel' },
    { type: 'content', content: 'lo' },
  ]);
  expect(second.done).toBe(true);
});

it('assistant runtime caches static single-message responses', async () => {
  await withMockedGitHubFetch(async () => {
    const cache = createMapCache();
    let providerCalls = 0;

    const first = await createAssistantReply({
      messages: [{ role: 'user', content: "What are Joseph's skills?" }],
      cache,
      complete: async (input) => {
        providerCalls += 1;
        expect(input.messages[0]?.role).toBe('system');
        return 'TypeScript, React, Node.js, and AI systems.';
      },
    });
    const second = await createAssistantReply({
      messages: [{ role: 'user', content: "What are Joseph's skills?" }],
      cache,
      complete: async () => {
        providerCalls += 1;
        return 'unexpected';
      },
    });

    expect(first.cacheStatus).toBe('MISS');
    expect(second.cacheStatus).toBe('HIT');
    expect(second.message).toBe(first.message);
    expect(providerCalls).toBe(1);
  });
});

it('assistant runtime bypasses cache for dynamic GitHub questions', async () => {
  await withMockedGitHubFetch(async () => {
    const cache = createMapCache({
      "What are Joseph's latest GitHub projects?": 'stale',
    });
    let providerCalls = 0;

    const reply = await createAssistantReply({
      messages: [{ role: 'user', content: "What are Joseph's latest GitHub projects?" }],
      cache,
      complete: async () => {
        providerCalls += 1;
        return 'fresh GitHub answer';
      },
    });

    expect(reply.cacheStatus).toBe('MISS');
    expect(reply.message).toBe('fresh GitHub answer');
    expect(providerCalls).toBe(1);
  });
});

it('github portfolio helpers rank, filter, and summarize repos consistently', () => {
  const repos = [
    createRepo({ name: 'portfolio', stargazers_count: 100 }),
    createRepo({ name: 'archived', archived: true, stargazers_count: 50 }),
    createRepo({ name: 'forked', fork: true, stargazers_count: 50 }),
    createRepo({
      name: 'newer',
      homepage: 'https://newer.example.com',
      language: 'TypeScript',
      topics: ['react'],
      stargazers_count: 3,
      pushed_at: '2026-04-01T00:00:00Z',
    }),
    createRepo({
      name: 'popular',
      stargazers_count: 10,
      pushed_at: '2025-01-01T00:00:00Z',
    }),
  ];

  expect(createGitHubProjectPreviews(repos).map((project) => project.name)).toEqual([
    'popular',
    'newer',
  ]);
  expect(createGitHubProjectPreviews(repos)[1]?.status).toBe('live');
  expect(
    createGitHubStatsSnapshot({
      repos,
      totalCommits: 12,
      now: new Date('2026-01-02T00:00:00Z'),
    }),
  ).toEqual({
    totalCommits: 12,
    totalRepos: 5,
    totalStars: 213,
    lastUpdated: '2026-01-02T00:00:00.000Z',
  });
});

it('portfolio prompt is generated from the shared knowledge surface', () => {
  const prompt = createPortfolioSystemPromptBase();
  expect(prompt).toMatch(/Joseph Sabag/);
  expect(prompt).toMatch(/Predicto AI/);
  expect(prompt).toMatch(/SmallBites/);
  expect(prompt).toMatch(/SEND_EMAIL/);
});
