import { afterAll, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma.js';

// Ensure DATABASE_URL points to test DB
if (!process.env.DATABASE_URL?.includes('verdeafrique_test')) {
  throw new Error('DATABASE_URL must point to test database (verdeafrique_test)');
}

// No migration here – now handled by globalSetup

beforeEach(async () => {
  // Clean all tables
  const tables = ['order_items', 'orders', 'cart_items', 'carts', 'sessions', 'products', 'users', 'categories'];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});