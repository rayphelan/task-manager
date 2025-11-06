import type { Request, Response } from 'express';
import { failure } from '../responses.js';

export function notFound(_req: Request, res: Response) {
  return failure(res, 404, 'Not found');
}
