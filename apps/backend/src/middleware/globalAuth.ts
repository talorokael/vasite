/* eslint-disable @typescript-eslint/no-namespace */

import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";  // ✅ use your shared instance

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export async function globalAuth(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/api/webhooks/paystack") {
    return next();
  }

  const sessionToken = req.cookies.session_token;
  if (!sessionToken) return next();

  try {
    const session = await prisma.session.findFirst({
      where: {
        token: sessionToken,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (session?.user) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      };
    }
  } catch (error) {
    console.error("Global auth error:", error);
  }
  next();
}