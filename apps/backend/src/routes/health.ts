import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import pkg from '../../package.json' with { type: 'json' };

const router: Router = Router();

router.get('/', async (req, res) => {
  let dbStatus = 'ok';
  let dbLatency = 0;
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - start;
  } catch {
    dbStatus = 'error';
  }

  res.status(dbStatus === 'ok' ? 200 : 503).json({
    status: dbStatus === 'ok' ? 'healthy' : 'degraded',
    version: pkg.version,
    timestamp: new Date().toISOString(),
    database: { status: dbStatus, latency_ms: dbLatency },
  });
});

export default router;