import { prisma } from './prisma.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Configuration
const SALT_ROUNDS = 12;
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/**
 * Hash a plain text password using bcrypt.
 * @param plainTextPassword - The user's plain text password.
 * @returns A promise that resolves to the hashed password string.
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

/**
 * Verify a plain text password against a stored bcrypt hash.
 * @param plainTextPassword - The password to verify.
 * @param hash - The stored hash to compare against.
 * @returns A promise that resolves to true if the password matches.
 */
export async function verifyPassword(
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hash);
}

/**
 * Create a new database session for a user.
 * Generates a secure token and sets an expiration date.
 * @param userId - The ID of the user to create a session for.
 * @returns The created Session object from the database.
 */
export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return session;
}

/**
 * Validate a session token.
 * Checks if the session exists, is not expired, and belongs to a valid user.
 * @param token - The session token to validate.
 * @returns The validated Session object (with user relation) or null if invalid.
 */
export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          // Do NOT include passwordHash
        }
      }
    },
  });

  // Check if session exists, is not expired, and user still exists
  if (!session || session.expiresAt < new Date() || !session.user) {
    // If session is invalid, clean it up
    if (session) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    }
    return null;
  }

  return session;
}

/**
 * Invalidate (delete) a session by its token.
 * Used for logging out.
 * @param token - The session token to invalidate.
 */
export async function invalidateSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  });
}