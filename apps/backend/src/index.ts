// apps/backend/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cartRoutes from './routes/cart.js';


// Import routes
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import statsRouter from './routes/stats.js';

import cookieParser from 'cookie-parser';

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3001;

/**
 * SECURITY MIDDLEWARE STACK
 * Order matters: security layers before routes
 */
app.use(helmet()); // 11 security headers
app.use(cookieParser());

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

/* const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter); */



app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

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

/**
 * HEALTH CHECK
 * Simple endpoint for monitoring/load balancers
 */
app.get('/api/health', (_, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    service: 'verdeafrique-backend'
  });
});

/**
 * 404 HANDLER
 * Catch-all for undefined routes
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
 * Last middleware in the chain
 */
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(500).json({
    error: 'Internal server error',
    message: isProduction ? 'Something went wrong' : error.message,
    ...(!isProduction && { stack: error.stack })
  });
    next(error)
});

/**
 * SERVER STARTUP
 */
app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
  console.log(`📊 Health: http://localhost:${port}/api/health`);
  console.log(`🛡️  Security: Enabled (Helmet, rate limiting)`);
});