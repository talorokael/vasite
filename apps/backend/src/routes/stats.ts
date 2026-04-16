// apps/backend/src/routes/stats.ts
import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { getCached } from '../lib/cache.js';   

const router: express.Router = express.Router();

// GET /api/admin/stats
router.get('/', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    
    const stats = await getCached('dashboard-stats', 60, async () => {
      const [totalUsers, totalProducts, totalCategories] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.category.count()
      ]);
      return {
        users: { total: totalUsers },
        products: { total: totalProducts },
        categories: { total: totalCategories },
        updatedAt: new Date().toISOString()
      };
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;