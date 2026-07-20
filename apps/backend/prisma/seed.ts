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
      name: 'Argan & Hemp Oil',
      sku: 'APOTH-001',
      description: 'Nourishing oil blend for skin and hair.',
      price: 17500,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/Argan & Hemp Oil - Resized.JPG'],
    },
    {
      name: 'Body Butter',
      sku: 'BODY-001',
      description: 'Rich hydrating body butter with shea.',
      price: 20000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Body')!.id,
      images: ['/images/products/Body Butter.jpg'],
    },
    {
      name: 'Cannabis Triple B Balm',
      sku: 'APOTH-002',
      description: 'Soothing balm with cannabis extracts.',
      price: 25000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/Cannabis Triple B Balm.jpg'],
    },
    {
      name: 'Face Cream (Turmeric)',
      sku: 'FACE-001',
      description: 'Anti‑inflammatory turmeric face cream.',
      price: 18000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Face')!.id,
      images: ['/images/products/Face Cream(Tumeric).jpg'],
    },
    {
      name: 'Hair Combo',
      sku: 'HAIR-001',
      description: 'Complete hair care set with oils and shampoos.',
      price: 36000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Hair')!.id,
      images: ['/images/products/Hair combo.jpg'],
    },
    {
      name: 'Massage Oil',
      sku: 'APOTH-003',
      description: 'Aromatic massage oil with essential oils.',
      price: 20000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/Massage Oil.jpg'],
    },
    {
      name: 'Soap 2',
      sku: 'BODY-002',
      description: 'Natural exfoliating soap bar.',
      price: 8000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Body')!.id,
      images: ['/images/products/Soap 2.jpg'],
    },
    {
      name: 'Supplements',
      sku: 'APOTH-004',
      description: 'Daily wellness supplement blend.',
      price: 21000,
      productType: ProductType.TINCTURE,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/Supplements.jpg'],
    },
    {
      name: 'Yoni Wash',
      sku: 'APOTH-005',
      description: 'Gentle herbal wash for intimate care.',
      price: 21000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/Yoni Wash.jpg'],
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