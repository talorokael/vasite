import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router: express.Router = express.Router();

// GET /api/admin/users/:userId/addresses (admin only)
router.get('/:userId/addresses', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = req.params.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
      select: {
        id: true,
        name: true,
        street: true,
        city: true,
        postalCode: true,
        country: true,
        phone: true,
        isDefault: true,
        createdAt: true,
      },
    });

    res.json({ addresses });
  } catch (error) {
    console.error('Error fetching user addresses (admin):', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// GET /api/admin/users/:userId/orders (admin only)
router.get('/:userId/orders', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = req.params.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching user orders (admin):', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
