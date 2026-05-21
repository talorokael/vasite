import { describe, it, beforeAll, beforeEach, expect } from 'vitest';
import type { User } from '@prisma/client';
import { createTestUser, loginAndGetCookie, authenticatedRequest } from './helpers.js';
import { prisma } from '../src/lib/prisma.js';

describe('Cache Invalidation', () => {
  let adminCookie: string;
  let adminUser: User;

  beforeAll(async () => {
    adminUser = await createTestUser('admin@cache.com', 'Admin123!', 'ADMIN');
    adminCookie = await loginAndGetCookie('admin@cache.com', 'Admin123!');
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();
  });

  it('should clear dashboard-stats cache after product creation', async () => {
    const res1 = await authenticatedRequest(adminCookie).get('/api/admin/stats');
    expect(res1.status).toBe(200);
    expect(res1.body.products.total).toBe(0);

    const productData = {
      name: 'Cache Test Product',
      price: 1999,
      productType: 'FLOWER',
      isAvailable: true,
    };
    const createRes = await authenticatedRequest(adminCookie)
      .post('/api/products')
      .send(productData);
    expect(createRes.status).toBe(201);

    const res2 = await authenticatedRequest(adminCookie).get('/api/admin/stats');
    expect(res2.body.products.total).toBe(1);
  });

  it('should clear products cache after product update', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Original Name',
        price: 999,
        productType: 'FLOWER',
        userId: adminUser.id,
      },
    });

    const getBefore = await authenticatedRequest(adminCookie).get('/api/products?page=1&limit=20');
    expect(getBefore.body.products[0].name).toBe('Original Name');

    await authenticatedRequest(adminCookie)
      .put(`/api/products/${product.id}`)
      .send({ name: 'Updated Name' });

    const getAfter = await authenticatedRequest(adminCookie).get('/api/products?page=1&limit=20');
    expect(getAfter.body.products[0].name).toBe('Updated Name');
  });

  it('should clear stats cache after product deletion', async () => {
    await prisma.product.create({
      data: {
        name: 'To Delete',
        price: 499,
        productType: 'FLOWER',
        userId: adminUser.id,
      },
    });

    const statsBefore = await authenticatedRequest(adminCookie).get('/api/admin/stats');
    expect(statsBefore.body.products.total).toBe(1);

    const product = await prisma.product.findFirst({ where: { name: 'To Delete' } });
    await authenticatedRequest(adminCookie).delete(`/api/products/${product!.id}`);

    const statsAfter = await authenticatedRequest(adminCookie).get('/api/admin/stats');
    expect(statsAfter.body.products.total).toBe(0);
  });
});