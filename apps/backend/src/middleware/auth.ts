import { Request, Response, NextFunction } from 'express';
import { validateSession } from '../lib/auth.js';

/**
 * Authentication Middleware
 * Extracts the Bearer token from the Authorization header,
 * validates the session, and attaches the user to the request object.
 */

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Extract token from cookie OR Authorization header (for compatibility)
    const token = req.cookies?.session_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // 2. Validate the session
    const session = await validateSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // 3. Attach the user to the request object
    req.user = session.user;

    // 4. Proceed
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}