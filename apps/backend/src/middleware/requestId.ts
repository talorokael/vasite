// apps/backend/src/middleware/requestId.ts

import { Request, Response, NextFunction } from 'express';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const id = req.headers['x-request-id'] as string || crypto.randomUUID();
  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
}