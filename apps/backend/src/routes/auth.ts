import express from 'express';
import { z } from 'zod'; // For robust input validation
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, createSession, invalidateSession, validateSession } from '../lib/auth.js';

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
  try {
    // 1. Validate request body
    const validatedData = registerSchema.parse(req.body);
    const { email, name, password } = validatedData;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    // 3. Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null, // Convert undefined to null
        passwordHash,
      },
      select: { id: true, email: true, name: true, role: true }, // Never return passwordHash
    });

    // 4. Create initial session for the new user
    const session = await createSession(user.id);

    // 5. Return user info and session token
    res.status(201).json({
      user,
      session: { token: session.token, expiresAt: session.expiresAt }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error('Registration error:', error);
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
    res.json({
      user: userWithoutHash,
      session: { token: session.token, expiresAt: session.expiresAt }
    });

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
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(400).json({ error: 'No session token provided' });
    }

    await invalidateSession(token);
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
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const session = await validateSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    res.json({ user: session.user });

  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;