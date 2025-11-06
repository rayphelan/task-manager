import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors.js';
import { failure } from '../responses.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const message = err.issues.map((i) => i.message).join('; ');
    return failure(res, 400, message || 'Validation error');
  }
  if (err instanceof AppError) {
    return failure(res, err.statusCode, err.message);
  }
  const message = err instanceof Error ? err.message : 'Internal server error';
  return failure(res, 500, message);
}
