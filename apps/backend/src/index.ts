// apps/backend/src/index.ts

// Validate environment variables first
import './lib/env.js';

import './lib/prisma.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';

import cartRoutes from './routes/cart.js';
import adminOrdersRouter from './routes/adminOrders.js';
import authRouter from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import statsRouter from './routes/stats.js';
import ordersRouter from './routes/orders.js';
import adminUsersRouter from './routes/adminUsers.js';
import checkoutRouter from './routes/checkout.js';
import addressRouter from './routes/address.js';
import { handlePaystackWebhook } from './webhooks/paystack.js';
import { handleCourierWebhook } from './webhooks/courier.js';
import { perUserRateLimit } from './middleware/perUserRateLimit.js';
import { globalAuth } from './middleware/globalAuth.js';
import { prisma } from './lib/prisma.js';
import { logger } from './lib/logger.js';

const app: express.Express = express();

app.set('trust proxy', 1);

const port = process.env.PORT || 3001;

/**
 * SECURITY & LOGGING MIDDLEWARE STACK
 */
app.use(helmet()); // Security headers
app.use(cookieParser());

// Structured HTTP logging (pino)
app.use(pinoHttp.default({
  logger,
  autoLogging: true,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      ip: req.ip,
    }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
}));

app.use(globalAuth);

// Rate limiting – disabled in development for easier debugging
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);
} else {
  logger.warn('⚠️ Rate limiting disabled in development');
}

// CORS – allow all origins (debugging only)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/**
 * PAYSTACK WEBHOOK
 * Must come before express.json()
 */
app.post(
  '/api/webhooks/paystack',
  express.raw({ type: 'application/json' }),
  handlePaystackWebhook
);

app.post(
  '/api/webhooks/courier',
  express.raw({ type: 'application/json' }),
  handleCourierWebhook
);

/**
 * JSON BODY PARSER
 */
app.use(express.json({ limit: '10mb' }));

/**
 * PER-USER RATE LIMITING
 */
app.use('/api/cart', perUserRateLimit(15 * 60 * 1000, 100));
app.use('/api/checkout', perUserRateLimit(15 * 60 * 1000, 10));

/**
 * ROUTE REGISTRATION
 */
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/stats', statsRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/address', addressRouter);

/**
 * HEALTH CHECK
 */
app.get('/api/health', async (_req, res) => {
  let dbStatus = 'ok';
  let dbLatency = 0;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - start;
  } catch (err) {
    dbStatus = 'error';
    logger.error({ err }, 'Health check DB error');
  }

  const isHealthy = dbStatus === 'ok';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      latency_ms: dbLatency,
    },
    service: 'verdeafrique-backend',
  });
});

/**
 * 404 HANDLER
 */
app.all(/.*/, (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error({ err: error }, 'Server error');

    const isProduction = process.env.NODE_ENV === 'production';

    res.status(500).json({
      error: 'Internal server error',
      message: isProduction ? 'Something went wrong' : error.message,
      ...(!isProduction && { stack: error.stack }),
    });

    next(error);
  }
);

/**
 * EXPORT APP FOR TESTING
 */
export { app };

/**
 * SERVER STARTUP
 * Prevent server from starting during tests
 */
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`🚀 Backend running on port ${port}`);
    logger.info(`📊 Health: http://localhost:${port}/api/health`);
    logger.info(`🛡️ Security: Enabled (Helmet, rate limiting, structured logs)`);
  });
}