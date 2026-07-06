import type { NextFunction, Request, Response } from 'express';
import {
  cleanupRateLimitStore,
  consumeRateLimit,
  RATE_LIMIT_PRESETS,
  type RateLimitEntry,
  type RateLimiterOptions,
} from '../core/rateLimit.js';

const ipStore = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 10 * 60 * 1000;
const UNKNOWN_CLIENT_IP = 'unknown';

setInterval(() => {
  cleanupRateLimitStore(ipStore);
}, CLEANUP_INTERVAL);

const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    // Raw example: "203.0.113.4, 70.41.3.18" -> ["203.0.113.4", " 70.41.3.18"]
    const [firstForwardedIp] = forwarded.split(',');
    const trimmedForwardedIp = firstForwardedIp?.trim();

    if (trimmedForwardedIp && trimmedForwardedIp.length > 0) {
      return trimmedForwardedIp;
    }

    return UNKNOWN_CLIENT_IP;
  }
  if (Array.isArray(forwarded)) {
    const [firstForwardedIp] = forwarded;

    if (firstForwardedIp !== undefined) {
      return firstForwardedIp;
    }

    return UNKNOWN_CLIENT_IP;
  }
  if (req.ip) {
    return req.ip;
  }
  if (req.socket.remoteAddress) {
    return req.socket.remoteAddress;
  }

  return UNKNOWN_CLIENT_IP;
};

export const createRateLimiter = (options: Partial<RateLimiterOptions> = {}) => {
  const config: RateLimiterOptions = { ...RATE_LIMIT_PRESETS.chat, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    const result = consumeRateLimit(ipStore, getClientIp(req), config);

    if (!result.allowed) {
      return res.status(result.status).json(result.body);
    }

    for (const [header, value] of Object.entries(result.headers)) {
      res.setHeader(header, value);
    }

    next();
  };
};

export const chatRateLimiter = createRateLimiter(RATE_LIMIT_PRESETS.chat);
export const ttsRateLimiter = createRateLimiter(RATE_LIMIT_PRESETS.voice);
export const sttRateLimiter = createRateLimiter(RATE_LIMIT_PRESETS.voice);
export const emailRateLimiter = createRateLimiter(RATE_LIMIT_PRESETS.emailServer);

export const getRateLimitStatus = (ip: string): RateLimitEntry | null => {
  const entry = ipStore.get(ip);

  if (entry === undefined) {
    return null;
  }

  return entry;
};

export const clearRateLimitEntry = (ip: string): boolean => ipStore.delete(ip);
