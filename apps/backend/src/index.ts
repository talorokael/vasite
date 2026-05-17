// apps/backend/src/index.ts
import './lib/prisma.js'; 
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cartRoutes from './routes/cart.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import statsRouter from './routes/stats.js';
import cookieParser from 'cookie-parser';
import ordersRouter from './routes/orders.js';
import checkoutRouter from './routes/checkout.js';
import { handlePaystackWebhook } from './webhooks/paystack.js';
import { perUserRateLimit } from './middleware/perUserRateLimit.js';
import { globalAuth } from './middleware/globalAuth.js';
import { prisma } from './lib/prisma.js';   



const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3001;


/**
 * SECURITY MIDDLEWARE STACK
 * Order matters: security layers before routes
 */
app.use(helmet()); // 11 security headers
app.use(cookieParser());
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
  console.log('⚠️  Rate limiting disabled in development');
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🟢 CATCH-ALL LOGGER – logs every incoming request
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

app.post('/api/webhooks/paystack', express.raw({ type: 'application/json' }), handlePaystackWebhook);

app.use(express.json({ limit: '10mb' }));

// Per-user rate limiting for sensitive endpoints
app.use('/api/cart', perUserRateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes
app.use('/api/checkout', perUserRateLimit(15 * 60 * 1000, 10)); // 10 checkout attempts per 15 minutes

/**
 * ROUTE REGISTRATION
 * All route logic belongs in their respective route files
 */
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', usersRouter);
app.use('/api/admin/stats', statsRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRouter);
app.use('/api/checkout', checkoutRouter);

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
    console.error('Health check DB error:', err);
  }

  const isHealthy = dbStatus === 'ok';
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    database: { status: dbStatus, latency_ms: dbLatency },
    service: 'verdeafrique-backend'
  });
});

/**
 * 404 HANDLER
 */
app.all(/.*/, (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method 
  });
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(500).json({
    error: 'Internal server error',
    message: isProduction ? 'Something went wrong' : error.message,
    ...(!isProduction && { stack: error.stack })
  });
  next(error);
});

/**
 * SERVER STARTUP
 */
app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
  console.log(`📊 Health: http://localhost:${port}/api/health`);
  console.log(`🛡️  Security: Enabled (Helmet, rate limiting)`);
});