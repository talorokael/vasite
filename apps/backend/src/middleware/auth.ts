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
    // 2. Extract token from the 'Authorization: Bearer <token>' header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Please provide a Bearer token.' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // 3. Validate the session using your existing utility
    const session = await validateSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }

    // 4. Attach the user to the request object for use in route handlers
    // Note: validateSession already excludes passwordHash via its select clause
    req.user = session.user;

    // 5. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}