// apps/backend/prisma/seed.ts
import 'dotenv/config'
import { hash } from 'bcrypt'
import { ProductType, StrainType, Role } from '@prisma/client'

// IMPORTANT: reuse the runtime Prisma client
import { prisma } from '../src/lib/prisma.js'

console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL)

async function main() {
  console.log('Starting seed...')

  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@verdeafrique.com' },
    update: {},
    create: {
      email: 'admin@verdeafrique.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  })

  const userPassword = await hash('user123', 10)
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Test Customer',
      passwordHash: userPassword,
      role: Role.USER,
    },
  })

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tinctures' },
      update: {},
      create: {
        name: 'Tinctures',
        description: 'CBD and THC oil extracts',
        slug: 'tinctures',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'flowers' },
      update: {},
      create: {
        name: 'Flowers',
        description: 'Dried cannabis flower',
        slug: 'flowers',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'edibles' },
      update: {},
      create: {
        name: 'Edibles',
        description: 'Cannabis-infused food products',
        slug: 'edibles',
      },
    }),
  ])

  await Promise.all([
    prisma.product.upsert({
      where: { sku: 'CBD-OIL-001' },
      update: {},
      create: {
        name: 'Premium CBD Oil',
        sku: 'CBD-OIL-001',
        description: 'High-quality full-spectrum CBD tincture.',
        price: 5999,
        productType: ProductType.TINCTURE,
        categoryId: categories[0].id,
        userId: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'FLOWER-SD-002' },
      update: {},
      create: {
        name: 'Sativa Flower - Sour Diesel',
        sku: 'FLOWER-SD-002',
        description: 'Energetic and uplifting sativa strain.',
        price: 4500,
        productType: ProductType.FLOWER,
        strainType: StrainType.SATIVA,
        categoryId: categories[1].id,
        userId: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'GUMMIES-500-003' },
      update: {},
      create: {
        name: 'CBD Gummies 500mg',
        sku: 'GUMMIES-500-003',
        description: 'Mixed fruit flavored CBD gummies.',
        price: 3500,
        productType: ProductType.EDIBLE,
        categoryId: categories[2].id,
        userId: admin.id,
      },
    }),
  ])

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
