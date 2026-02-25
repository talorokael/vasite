import express from 'express';
import { z } from 'zod'; // For robust input validation
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, createSession, invalidateSession, validateSession } from '../lib/auth.js';
import { SESSION_DURATION_MS } from '../lib/auth.js';

const setSessionCookie = (res: express.Response, token: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('session_token', token, {
    httpOnly: true,
    secure: isProduction, 
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: SESSION_DURATION_MS,
    path: '/',
  });
};

const router: express.Router = express.Router();

// Input validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * POST /api/auth/register
 * Creates a new user account and initial session.
 */
router.post('/register', async (req, res) => {
  const requestId = req.id || 'no-id';
  console.log(`[${requestId}] [POST /register] Started`, req.body.email);

  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, name, password } = validatedData;

    console.log(`[${requestId}] [POST /register] Validated:`, { email, name });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log(`[${requestId}] [POST /register] User already exists:`, email);
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name: name || null, passwordHash },
      select: { id: true, email: true, name: true, role: true },
    });

    console.log(`[${requestId}] [POST /register] User created:`, user.id, user.email);

    const session = await createSession(user.id);
    console.log(`[${requestId}] [POST /register] Session created:`, session.token.substring(0,10), 'expires:', session.expiresAt);

    setSessionCookie(res, session.token);
    console.log(`[${requestId}] [POST /register] Cookie set, returning user`);

    res.json({ user, token: session.token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(`[${requestId}] [POST /register] Validation error:`, error.issues);
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error(`[${requestId}] [POST /register] Error:`, error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

/**
 * POST /api/auth/login
 * Authenticates a user and creates a new session.
 */
router.post('/login', async (req, res) => {
  try {
    // 1. Validate request body
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // 2. Find user (INCLUDING passwordHash for verification)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, passwordHash: true }
    });

    // 3. Verify user exists and password matches
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      // Use the same generic message to prevent user enumeration
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. Create a new session
    const session = await createSession(user.id);

    // 5. Return user info (without passwordHash) and session
    const { passwordHash, ...userWithoutHash } = user;
    void passwordHash;
    setSessionCookie(res, session.token);
    res.json({ user: userWithoutHash, token: session.token });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

/**
 * POST /api/auth/logout
 * Invalidates the current session.
 * Expects the session token in the Authorization header.
 */
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.session_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(400).json({ error: 'No session token provided' });
    }

    await invalidateSession(token);
    
    // Clear the cookie
    res.clearCookie('session_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    
    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error during logout' });
  }
});

/**
 * GET /api/auth/me
 * Returns the current authenticated user's information.
 * Protected route - requires valid session token.
 */
router.get('/me', async (req, res) => {
  const requestId = req.id || 'no-id';
  console.log(`[${requestId}] [GET /me] Started`);

  try {
    const token = req.cookies?.session_token || req.headers.authorization?.replace('Bearer ', '');
    console.log(`[${requestId}] [GET /me] Token from cookie:`, token ? `${token.substring(0,10)}...` : 'none');
    console.log(`[${requestId}] [GET /me] All cookies:`, req.cookies);

    if (!token) {
      console.log(`[${requestId}] [GET /me] No token → 401`);
      return res.status(401).json({ error: 'Authentication required' });
    }

    const session = await validateSession(token);
    console.log(`[${requestId}] [GET /me] validateSession result:`, session ? 'valid' : 'invalid');

    if (!session) {
      console.log(`[${requestId}] [GET /me] Session invalid/expired → 401`);
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    console.log(`[${requestId}] [GET /me] User found:`, session.user.id, session.user.email, 'Role:', session.user.role);
    res.json({ user: session.user });
  } catch (error) {
    console.error(`[${requestId}] [GET /me] Error:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;