import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// 1. CRITICAL: Force-load environment variables at module initialization
import 'dotenv/config'

// 2. Validate DATABASE_URL exists immediately
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

// 3. Create pool and adapter ONLY after env is confirmed loaded
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
})

const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient( {adapter} )

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma