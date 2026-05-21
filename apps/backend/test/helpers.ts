import request from 'supertest';
import { app } from '../src/index.js'; // need to export app from index.ts
import { prisma } from '../src/lib/prisma.js';

export const createTestUser = async (
  email = 'test@example.com',
  password = 'Test123!',
  role: 'USER' | 'ADMIN' = 'USER'
) => {
  const hashed = await import('bcrypt').then(m => m.hash(password, 10));
  return prisma.user.create({
    data: { email, passwordHash: hashed, role },
  });
};

export const loginAndGetCookie = async (email: string, password: string) => {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  const cookie = res.headers['set-cookie']?.[0];
  if (!cookie) throw new Error('No session cookie returned');
  return cookie;
};

export const authenticatedRequest = (cookie: string) => {
  return request(app).set('Cookie', cookie);
};
