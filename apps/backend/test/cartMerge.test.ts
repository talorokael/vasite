import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import { app } from '../src/index.js';
import { createTestUser, loginAndGetCookie } from './helpers.js';
import { prisma } from '../src/lib/prisma.js';

describe('Cart Merge', () => {
  let productId: string;
  let user: Awaited<ReturnType<typeof createTestUser>>;

  beforeAll(async () => {
    user = await createTestUser('merge@test.com', 'Pass123!');
    // Create a real product for the test
    const product = await prisma.product.create({
      data: {
        name: 'Merge Test Product',
        price: 1999,
        productType: 'FLOWER',
        userId: user.id,
      },
    });
    productId = product.id;
  });

  it('should merge guest cart items into user cart after login', async () => {
    const cookie = await loginAndGetCookie('merge@test.com', 'Pass123!');

    const guestItems = [{ productId, quantity: 2 }];

    const res = await request(app)
      .post('/api/cart/merge')
      .set('Cookie', cookie)
      .send({ items: guestItems });

    expect(res.status).toBe(200);

    // Verify cart items were created
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });
    expect(cart?.items).toHaveLength(1);
    expect(cart?.items[0].quantity).toBe(2);
  });
});