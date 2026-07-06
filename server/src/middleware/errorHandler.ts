import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';
import { CoreHttpError } from '../core/requestValidation.js';

const HTTP_INTERNAL_SERVER_ERROR = 500;

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    logger.warn('operational_error', { message: err.message, statusCode: err.statusCode });
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  if (err instanceof CoreHttpError) {
    logger.warn('operational_error', { message: err.message, statusCode: err.status });
    return res.status(err.status).json({
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
