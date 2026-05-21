import { describe, it, expect, beforeAll } from 'vitest';

// Force production mode BEFORE importing app
process.env.NODE_ENV = 'production';

// Now import app and helpers
import request from 'supertest';
import { app } from '../src/index.js';
import { createTestUser, loginAndGetCookie } from './helpers.js';

describe('Rate Limiting', () => {
  let cookie: string;

  beforeAll(async () => {
    await createTestUser('ratelimit@test.com', 'Pass123!');
    cookie = await loginAndGetCookie('ratelimit@test.com', 'Pass123!');
  });

  it('should block more than 100 cart requests per 15 minutes for a user', async () => {
    for (let i = 0; i < 101; i++) {
      const res = await request(app).get('/api/cart').set('Cookie', cookie);
      if (i < 100) {
        expect(res.status).not.toBe(429);
      } else {
        expect(res.status).toBe(429);
      }
    }
  });
});