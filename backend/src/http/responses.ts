import type { Response } from 'express';

export function success<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function created<T>(res: Response, data: T) {
  return success(res, data, 201);
}

export function failure(res: Response, status: number, error: string) {
  return res.status(status).json({ success: false, error });
}


