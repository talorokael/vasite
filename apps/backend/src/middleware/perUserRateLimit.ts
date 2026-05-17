import rateLimit, { ipKeyGenerator } from 'express-rate-limit';  // ← Add ipKeyGenerator
import type { Request } from 'express';

export const perUserRateLimit = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req: Request) => {
      const anyReq = req as Request & { user?: { id?: string } };
      // 1. Use user ID for authenticated users
      if (anyReq.user?.id) {
        return `user:${anyReq.user.id}`;
      }
      
      // 2. For unauthenticated users, use the ipKeyGenerator to safely handle IPv6
      // This applies a /56 subnet mask to IPv6 addresses, preventing bypass attempts
      const ip = req.ip || 'unknown';
      return ipKeyGenerator(ip, 56);  // ← The key change
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => req.path === '/api/webhooks/paystack',
  });
};