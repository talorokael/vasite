// apps/backend/prisma/seed.ts
import 'dotenv/config';
import { hash } from 'bcrypt';
import { ProductType, StrainType, Role } from '../src/generated/prisma/client.js';
import { prisma } from '../src/lib/prisma.js';

console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);

async function main() {
  console.log('Starting non-destructive catalog seed...');

  // 1. Ensure the six catalog categories exist.
  const categoryNames = ['Hair', 'Body', 'Face', 'Flower', 'Edible', 'Apothecary'];
  const categories = await Promise.all(
    categoryNames.map(async (name) => {
      const slug = name.toLowerCase();
      return prisma.category.upsert({
        where: { slug },
        update: {
          name,
          description: `${name} products`,
        },
        create: {
          name,
          description: `${name} products`,
          slug,
        },
      });
    })
  );

  console.log(`Created ${categories.length} categories:`, categories.map(c => c.name));

  // 2. Ensure admin and test user exist (preserve existing users)
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

  // 3. Add or update products represented by public/images/products.
  const sampleProducts = [
    {
      name: 'Argan & Hemp Oil',
      sku: 'APOTH-001',
      description: 'Nourishing oil blend for skin and hair.',
      price: 17500,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/Argan+.png'],
    },
    {
      name: 'Body Butter',
      sku: 'BODY-001',
      description: 'Rich hydrating body butter with shea.',
      price: 20000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Body')!.id,
      images: ['/images/products/BodyB.png'],
    },
    {
      name: 'Triple B Balm',
      sku: 'APOTH-002',
      description: 'Soothing balm with cannabis extracts.',
      price: 25000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/TripleB.png'],
    },
    {
      name: 'Face Cream (Turmeric)',
      sku: 'FACE-001',
      description: 'Anti‑inflammatory turmeric face cream.',
      price: 18000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Face')!.id,
      images: ['/images/products/Face-Tum.png'],
    },
    {
      name: 'Hair Combo',
      sku: 'HAIR-001',
      description: 'Complete hair care set with oils and shampoos.',
      price: 36000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Hair')!.id,
      images: ['/images/products/Hair Combo.png'],
    },
    {
      name: 'Green Paradise Massage Oil',
      sku: 'APOTH-003',
      description: 'Aromatic massage oil with essential oils.',
      price: 20000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/MassOil.png'],
    },
    {
      name: 'Activated Charcoal Soap',
      sku: 'BODY-002',
      description: 'Natural exfoliating soap bar.',
      price: 8000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Body')!.id,
      images: ['/images/products/Soap - Charcoal.png'],
    },
    {
      name: 'Sinsevuka Capsules',
      sku: 'APOTH-004',
      description: 'Daily wellness supplement blend.',
      price: 21000,
      productType: ProductType.TINCTURE,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/Vuka.png'],
    },
    {
      name: 'Yoni Wash',
      sku: 'APOTH-005',
      description: 'Gentle herbal wash for intimate care.',
      price: 21000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/Yoni.png'],
    },
    {
      name: 'Spiced Root Beard Oil',
      sku: 'HAIR-002',
      description: 'Natural beard conditioning oil with a warm spice scent.',
      price: 16000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Hair')!.id,
      images: ['/images/products/Beard.png'],
    },
    {
      name: 'Night Repair Serum',
      sku: 'FACE-002',
      description: 'Botanical facial serum for an evening skincare routine.',
      price: 22000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Face')!.id,
      images: ['/images/products/Night.png'],
    },
    {
      name: 'Scalp and Hair Moisturizing Butter',
      sku: 'HAIR-003',
      description: 'Moisturizing butter that conditions and protects the hair shaft.',
      price: 24000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Hair')!.id,
      images: ['/images/products/Scalp (2).png'],
    },
    {
      name: 'Rapid Hair Growth Oil',
      sku: 'HAIR-004',
      description: 'Botanical scalp oil for a nourishing hair care routine.',
      price: 22000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Hair')!.id,
      images: ['/images/products/Scalp.png'],
    },
    {
      name: 'Womb Massage Oil',
      sku: 'APOTH-006',
      description: 'Botanical massage oil for personal wellness rituals.',
      price: 20000,
      productType: ProductType.TOPICAL,
      categoryId: categories.find(c => c.name === 'Apothecary')!.id,
      images: ['/images/products/Womb.png'],
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        ...product,
        userId: admin.id,
      },
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