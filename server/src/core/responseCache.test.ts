import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResponseCache } from './responseCache.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('ResponseCache', () => {
  it('stores and returns cacheable skill-style questions with normalized keys', () => {
    const cache = new ResponseCache();

    cache.set('What are your skills?', 'TypeScript and React');
    expect(cache.get('What are your skills?')).toBe('TypeScript and React');
    // Key normalizes case, punctuation, and whitespace.
    expect(cache.get('  what are your skills?!  ')).toBe('TypeScript and React');
    expect(cache.get('what   are   your   skills')).toBe('TypeScript and React');
    expect(cache.size).toBe(1);
  });

  it('ignores non-cacheable messages on get and set', () => {
    const cache = new ResponseCache();

    cache.set('What is the weather in Tel Aviv?', 'sunny');
    expect(cache.get('What is the weather in Tel Aviv?')).toBeNull();
    expect(cache.size).toBe(0);

    expect(cache.get('random gibberish xyz')).toBeNull();
  });

  it('treats common portfolio intents as cacheable', () => {
    const cache = new ResponseCache();
    const cacheableMessages = [
      'tell me about your portfolio',
      'what is your tech stack',
      'who is Joseph',
      'education and bootcamp',
      'how can I contact or hire you',
      'background and career experience',
    ];

    for (const message of cacheableMessages) {
      cache.set(message, `answer for ${message}`);
      expect(cache.get(message)).toBe(`answer for ${message}`);
    }
  });

  it('expires entries after the one-hour TTL', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    const cache = new ResponseCache();
    cache.set('Tell me about your skills', 'cached skills');
    expect(cache.get('Tell me about your skills')).toBe('cached skills');

    vi.setSystemTime(new Date('2026-01-01T01:00:01Z'));
    expect(cache.get('Tell me about your skills')).toBeNull();
    expect(cache.size).toBe(0);
  });

  it('cleanup removes only expired entries', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    const cache = new ResponseCache();
    cache.set('skills list please', 'old');

    vi.setSystemTime(new Date('2026-01-01T00:30:00Z'));
    cache.set('portfolio overview', 'fresh');

    vi.setSystemTime(new Date('2026-01-01T01:00:01Z'));
    cache.cleanup();

    expect(cache.get('skills list please')).toBeNull();
    expect(cache.get('portfolio overview')).toBe('fresh');
    expect(cache.getStats()).toEqual({ size: 1, maxSize: 100 });
  });

  it('evicts the oldest insertion when max size is reached', () => {
    const cache = new ResponseCache();
    // Bypass public isCacheable by using a known-matching stem + unique suffix.
    for (let index = 0; index < 100; index += 1) {
      cache.set(`skills topic ${index}`, `answer ${index}`);
    }
    expect(cache.size).toBe(100);
    expect(cache.get('skills topic 0')).toBe('answer 0');

    cache.set('skills topic overflow', 'answer overflow');
    expect(cache.size).toBe(100);
    expect(cache.get('skills topic 0')).toBeNull();
    expect(cache.get('skills topic overflow')).toBe('answer overflow');
    expect(cache.get('skills topic 1')).toBe('answer 1');
  });
});
