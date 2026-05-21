import { execSync } from 'child_process';
import { prisma } from '../src/lib/prisma.js';

export async function setup() {
  console.log('🌍 Running global setup for tests...');
  // Run migrations once
  execSync('pnpm prisma migrate deploy', { stdio: 'inherit', cwd: __dirname + '/..' });
  console.log('✅ Migrations applied');
}

export async function teardown() {
  await prisma.$disconnect();
  console.log('👋 Global teardown complete');
}