// apps/backend/src/routes/stats.ts
import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router: express.Router = express.Router();

// GET /api/admin/stats
router.get('/', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalCategories] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count()
    ]);

    res.json({
      users: { total: totalUsers },
      products: { total: totalProducts },
      categories: { total: totalCategories },
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
