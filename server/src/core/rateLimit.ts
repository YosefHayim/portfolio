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
    blockDurationMs: 60 * 1000,
    maxViolations: 5,
    permanentBlockAfterViolations: 10,
  },
} satisfies Record<string, RateLimiterOptions>;

export const createRateLimitEntry = (now: number): RateLimitEntry => ({
  count: 0,
  windowStart: now,
  burstCount: 0,
  burstWindowStart: now,
  blockedUntil: 0,
  violations: 0,
});

export const consumeRateLimit = (
  store: Map<string, RateLimitEntry>,
  key: string,
  options: RateLimiterOptions,
  now = Date.now(),
): RateLimitResult => {
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
      'X-RateLimit-Remaining': String(Math.max(0, options.maxRequests - entry.count)),
      'X-RateLimit-Reset': String(Math.ceil((entry.windowStart + options.windowMs) / 1000)),
    },
  };
};

export const cleanupRateLimitStore = (
  store: Map<string, RateLimitEntry>,
  now = Date.now(),
): void => {
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > RATE_ENTRY_MAX_AGE_MS && now >= entry.blockedUntil) {
      store.delete(key);
    }
  }
};
