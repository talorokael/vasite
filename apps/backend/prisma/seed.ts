// apps/backend/prisma/seed.ts
import 'dotenv/config';
import { hash } from 'bcrypt';
import { ProductType, StrainType, Role } from '@prisma/client';
import { prisma } from '../src/lib/prisma.js';

console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);

async function main() {
  console.log('Starting seed – replacing categories...');

  // 1. Delete existing products and categories (in correct order)
  console.log('Clearing existing products and categories...');
  await prisma.cartItem.deleteMany();   // clears cart items first
  await prisma.cart.deleteMany();       // then carts
  await prisma.orderItem.deleteMany();  // order items
  await prisma.order.deleteMany();      // orders
  await prisma.product.deleteMany();    // products
  await prisma.category.deleteMany();   // categories

  // 2. Recreate the six new categories
  const categoryNames = ['Hair', 'Body', 'Face', 'Flower', 'Edible', 'Apothecary'];
  const categories = await Promise.all(
    categoryNames.map(async (name) => {
      const slug = name.toLowerCase();
      return prisma.category.create({
        data: {
          name,
          description: `${name} products`,
          slug,
        },
      });
    })
  );

  console.log(`Created ${categories.length} categories:`, categories.map(c => c.name));

  // 3. Ensure admin and test user exist (preserve existing users)
  const adminPasswordEnv = process.env.ADMIN_PASSWORD;
  if (!adminPasswordEnv) {
    console.error('❌ ADMIN_PASSWORD environment variable is required for seeding');
    process.exit(1);
  }

  const adminPassword = await hash(adminPasswordEnv, 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@verdeafrique.com' },
    update: {},
    create: {
      email: 'admin@verdeafrique.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const userPassword = await hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Test Customer',
      passwordHash: userPassword,
      role: Role.USER,
    },
  });

  // 4. Add sample products for each new category (optional)
  const sampleProducts = [
    {
      name: 'Nourishing Hair Oil',
      sku: 'HAIR-001',
      description: 'Rich oil for hair growth and scalp health.',
      price: 2999,
      productType: ProductType.TINCTURE,
      categoryId: categories.find(c => c.name === 'Hair')!.id,
    },
    {
      name: 'Body Butter Cream',
      sku: 'BODY-001',
      description: 'Hydrating body lotion with shea butter.',
      price: 2499,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Body')!.id,
    },
    {
      name: 'Facial Serum',
      sku: 'FACE-001',
      description: 'Anti‑aging serum with CBD.',
      price: 3999,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Face')!.id,
    },
    {
      name: 'Premium Flower – Sativa',
      sku: 'FLOWER-001',
      description: 'Dried sativa flower.',
      price: 4500,
      productType: ProductType.FLOWER,
      strainType: StrainType.SATIVA,
      categoryId: categories.find(c => c.name === 'Flower')!.id,
    },
    {
      name: 'CBD Gummies 500mg',
      sku: 'EDIBLE-001',
      description: 'Mixed fruit gummies.',
      price: 3500,
      productType: ProductType.EDIBLE,
      categoryId: categories.find(c => c.name === 'Edible')!.id,
    },
    {
      name: 'Herbal Apothecary Kit',
      sku: 'APOTH-001',
      description: 'Wellness bundle with tinctures and teas.',
      price: 5999,
      productType: ProductType.TINCTURE,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        ...product,
        userId: admin.id,
      },
    });
  }

  console.log(`Added ${sampleProducts.length} sample products.`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });