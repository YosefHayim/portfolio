import { describe, expect, it } from '@effect/vitest';
import {
  RATE_ENTRY_MAX_AGE_MS,
  RATE_LIMIT_PRESETS,
  cleanupRateLimitStore,
  consumeRateLimit,
  createRateLimitEntry,
  type RateLimitEntry,
  type RateLimiterOptions,
} from './rateLimit.js';

const tightLimits: RateLimiterOptions = {
  windowMs: 60_000,
  maxRequests: 3,
  burstWindowMs: 10_000,
  maxBurst: 2,
  blockDurationMs: 5_000,
  maxViolations: 3,
  permanentBlockAfterViolations: 3,
};

const emptyStore = (): Map<string, RateLimitEntry> => new Map();

describe('createRateLimitEntry', () => {
  it('starts counts and windows at zero for the given clock', () => {
    const now = 1_700_000_000_000;
    expect(createRateLimitEntry(now)).toEqual({
      count: 0,
      windowStart: now,
      burstCount: 0,
      burstWindowStart: now,
      blockedUntil: 0,
      violations: 0,
    });
  });
});

describe('consumeRateLimit', () => {
  it('allows traffic under both window and burst caps and sets remaining headers', () => {
    const store = emptyStore();
    const now = 1_000;

    const first = consumeRateLimit(store, 'client-a', tightLimits, now);
    const second = consumeRateLimit(store, 'client-a', tightLimits, now + 1);

    expect(first).toEqual({
      allowed: true,
      headers: {
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '2',
        'X-RateLimit-Reset': String(Math.ceil((now + tightLimits.windowMs) / 1000)),
      },
    });
    expect(second).toMatchObject({
      allowed: true,
      headers: {
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '1',
      },
    });
    expect(store.get('client-a')?.count).toBe(2);
    expect(store.get('client-a')?.burstCount).toBe(2);
  });

  it('tracks clients independently in the same store', () => {
    const store = emptyStore();
    const now = 5_000;

    expect(consumeRateLimit(store, 'alpha', tightLimits, now).allowed).toBe(true);
    expect(consumeRateLimit(store, 'beta', tightLimits, now).allowed).toBe(true);
    expect(store.size).toBe(2);
    expect(store.get('alpha')?.count).toBe(1);
    expect(store.get('beta')?.count).toBe(1);
  });

  it('blocks on burst before the rolling window is exhausted', () => {
    const store = emptyStore();
    const now = 10_000;

    expect(consumeRateLimit(store, 'bursty', tightLimits, now).allowed).toBe(true);
    expect(consumeRateLimit(store, 'bursty', tightLimits, now + 1).allowed).toBe(true);

    const blocked = consumeRateLimit(store, 'bursty', tightLimits, now + 2);
    expect(blocked).toEqual({
      allowed: false,
      status: 429,
      body: {
        success: false,
        error: 'Too many requests. You have been blocked for 5 seconds.',
        blocked: true,
        retryAfter: 5,
        violations: 1,
      },
    });
    expect(store.get('bursty')?.violations).toBe(1);
    expect(store.get('bursty')?.blockedUntil).toBe(now + 2 + tightLimits.blockDurationMs);
  });

  it('blocks on maxRequests when burst is not the trigger', () => {
    const store = emptyStore();
    // maxBurst 5, maxRequests 3 — slow spaced hits still trip the window cap.
    const options: RateLimiterOptions = {
      ...tightLimits,
      maxBurst: 5,
      maxRequests: 3,
      burstWindowMs: 1,
    };
    const start = 20_000;

    expect(consumeRateLimit(store, 'window', options, start).allowed).toBe(true);
    expect(consumeRateLimit(store, 'window', options, start + 100).allowed).toBe(true);
    expect(consumeRateLimit(store, 'window', options, start + 200).allowed).toBe(true);

    const blocked = consumeRateLimit(store, 'window', options, start + 300);
    expect(blocked.allowed).toBe(false);
    if (blocked.allowed) {
      throw new Error('expected window block');
    }
    expect(blocked.status).toBe(429);
    expect(blocked.body.violations).toBe(1);
  });

  it('returns temporary block while blockedUntil is in the future', () => {
    const store = emptyStore();
    const now = 30_000;
    store.set('held', {
      ...createRateLimitEntry(now),
      blockedUntil: now + 12_500,
      violations: 1,
    });

    const denied = consumeRateLimit(store, 'held', tightLimits, now + 500);
    expect(denied).toEqual({
      allowed: false,
      status: 429,
      body: {
        success: false,
        error: 'You are temporarily blocked. Try again in 12 seconds.',
        blocked: true,
        retryAfter: 12,
      },
    });
    // Temporary denial must not increment counters.
    expect(store.get('held')?.count).toBe(0);
  });

  it('resets window and burst counters after their windows elapse', () => {
    const store = emptyStore();
    const start = 40_000;

    consumeRateLimit(store, 'reset', tightLimits, start);
    consumeRateLimit(store, 'reset', tightLimits, start + 1);
    expect(store.get('reset')?.count).toBe(2);
    expect(store.get('reset')?.burstCount).toBe(2);

    const afterWindows = consumeRateLimit(
      store,
      'reset',
      tightLimits,
      start + tightLimits.windowMs + 1,
    );
    expect(afterWindows.allowed).toBe(true);
    expect(store.get('reset')?.count).toBe(1);
    expect(store.get('reset')?.burstCount).toBe(1);
  });

  it('escalates block duration with each violation up to five times base', () => {
    const store = emptyStore();
    // Force a violation immediately via maxBurst = 0 (first request is already over).
    const options: RateLimiterOptions = {
      ...tightLimits,
      maxRequests: 1,
      maxBurst: 0,
      blockDurationMs: 1_000,
      permanentBlockAfterViolations: 10,
    };
    const t0 = 50_000;

    const firstViolation = consumeRateLimit(store, 'escalator', options, t0);
    expect(firstViolation.allowed).toBe(false);
    if (firstViolation.allowed) {
      throw new Error('expected first violation');
    }
    expect(firstViolation.body.retryAfter).toBe(1);
    expect(store.get('escalator')?.blockedUntil).toBe(t0 + 1_000);

    // After block expires, trip again — duration multiplies by min(violations, 5).
    const t1 = t0 + 1_001;
    const secondViolation = consumeRateLimit(store, 'escalator', options, t1);
    expect(secondViolation.allowed).toBe(false);
    if (secondViolation.allowed) {
      throw new Error('expected second violation');
    }
    expect(secondViolation.body.retryAfter).toBe(2);
    expect(store.get('escalator')?.violations).toBe(2);
    expect(store.get('escalator')?.blockedUntil).toBe(t1 + 2_000);
  });

  it('permanently blocks once violations reach the permanent threshold', () => {
    const store = emptyStore();
    store.set('abuser', {
      ...createRateLimitEntry(60_000),
      violations: tightLimits.permanentBlockAfterViolations,
    });

    const denied = consumeRateLimit(store, 'abuser', tightLimits, 60_000);
    expect(denied).toEqual({
      allowed: false,
      status: 403,
      body: {
        success: false,
        error: 'Access denied. You have been permanently blocked due to repeated abuse.',
        blocked: true,
        permanent: true,
      },
    });
  });

  it('chat preset allows a full burst then blocks the next hit', () => {
    const store = emptyStore();
    const now = 70_000;
    const { chat } = RATE_LIMIT_PRESETS;

    for (let index = 0; index < chat.maxBurst; index += 1) {
      const decision = consumeRateLimit(store, 'chat-user', chat, now + index);
      expect(decision.allowed).toBe(true);
    }

    const over = consumeRateLimit(store, 'chat-user', chat, now + chat.maxBurst);
    expect(over.allowed).toBe(false);
    if (over.allowed) {
      throw new Error('expected chat preset burst block');
    }
    expect(over.status).toBe(429);
    expect(over.body.violations).toBe(1);
  });
});

describe('cleanupRateLimitStore', () => {
  it('removes stale unblocked entries and keeps young or still-blocked ones', () => {
    const store = emptyStore();
    const now = 100_000;

    store.set('fresh', createRateLimitEntry(now - 1_000));
    store.set('stale', createRateLimitEntry(now - RATE_ENTRY_MAX_AGE_MS - 1));
    store.set('blocked-stale', {
      ...createRateLimitEntry(now - RATE_ENTRY_MAX_AGE_MS - 1),
      blockedUntil: now + 5_000,
    });

    cleanupRateLimitStore(store, now);

    expect(store.has('fresh')).toBe(true);
    expect(store.has('stale')).toBe(false);
    expect(store.has('blocked-stale')).toBe(true);
  });
});

describe('RATE_LIMIT_PRESETS', () => {
  it('defines chat, voice, and both email surfaces with permanent block thresholds', () => {
    expect(Object.keys(RATE_LIMIT_PRESETS).sort()).toEqual([
      'chat',
      'emailServer',
      'emailWorker',
      'voice',
    ]);
    expect(RATE_LIMIT_PRESETS.chat.maxRequests).toBe(20);
    expect(RATE_LIMIT_PRESETS.voice.maxRequests).toBe(10);
    expect(RATE_LIMIT_PRESETS.emailServer.permanentBlockAfterViolations).toBe(5);
    expect(RATE_LIMIT_PRESETS.emailWorker.permanentBlockAfterViolations).toBe(10);
  });
});
