import 'dotenv/config';  
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1),
  FRONTEND_URL: z.string().min(1), // raw string before splitting
  COOKIE_SECRET: z.string().min(32),
  SESSION_SECURE_COOKIE: z.enum(['true', 'false']).transform(v => v === 'true'),
  PAYSTACK_SECRET_KEY: z.string().min(1),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),
  PORT: z.string().default('4000').transform(Number),
});

export const env = envSchema.parse(process.env);