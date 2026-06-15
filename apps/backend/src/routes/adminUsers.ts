import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router: express.Router = express.Router();

// GET /api/admin/users (admin only)
router.get('/', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const totalCount = await prisma.user.count();

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            addresses: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users (admin):', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id (admin only) — update user role
router.put('/:id', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id) return res.status(400).json({ error: 'userId is required' });

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'User not found' });

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true, updatedAt: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating user (admin):', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

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
