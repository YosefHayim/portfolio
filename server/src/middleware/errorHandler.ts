import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';
import { HTTP_ERROR_MESSAGE } from '../core/httpErrors.js';

const HTTP_INTERNAL_SERVER_ERROR = 500;

/** Map known operational messages to HTTP status. Unknown errors become 500. */
const OPERATIONAL_STATUS_BY_MESSAGE: Readonly<Record<string, number>> = {
  [HTTP_ERROR_MESSAGE.invalidRequestBody]: 400,
  [HTTP_ERROR_MESSAGE.invalidAudioContentType]: 400,
  [HTTP_ERROR_MESSAGE.noAudioData]: 400,
  [HTTP_ERROR_MESSAGE.emailNotConfigured]: 503,
  [HTTP_ERROR_MESSAGE.aiNotConfigured]: 503,
  [HTTP_ERROR_MESSAGE.noAiResponse]: 500,
};

/**
 * Resolves an HTTP status for a thrown Error at the Express boundary.
 *
 * @param err - Error thrown from routes or core.
 * @returns Operational status when the message is known; otherwise undefined.
 */
const statusOf = (err: Error): number | undefined => OPERATIONAL_STATUS_BY_MESSAGE[err.message];

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = statusOf(err);

  if (status !== undefined) {
    logger.warn('operational_error', { message: err.message, statusCode: status });
    return res.status(status).json({
      success: false,
      error: err.message,
    });
  }

  logger.error('unexpected_error', {
    message: err.message,
    stack: err.stack,
  });

  return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
    success: false,
    error: 'An unexpected error occurred',
  });
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
