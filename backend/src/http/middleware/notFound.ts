import type { Request, Response, NextFunction } from 'express';
import { failure } from '../responses.js';

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  return failure(res, 404, 'Not found');
}


