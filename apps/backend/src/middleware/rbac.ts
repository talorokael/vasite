import { Request, Response, NextFunction } from 'express';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if the authenticated user has the required role.
 * @param allowedRoles - Array of role strings that are permitted.
 */
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Ensure authentication middleware ran first
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // 2. Check if the user's role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You do not have permission to access this resource.' 
      });
    }

    // 3. User has permission, proceed
    next();
  };
}