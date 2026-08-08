// apps/backend/scripts/update-descriptions.ts
import { prisma } from '../src/lib/prisma.js';

const updates = [
  { sku: 'APOTH-001', description: 'New description for Argan & Hemp Oil' },
  // ... more
];

async function run() {
  for (const { sku, description } of updates) {
    await prisma.product.update({
      where: { sku },
      data: { description },
    });
    console.log(`Updated ${sku}`);
  }
  console.log('Done.');
}

run().finally(() => prisma.$disconnect());