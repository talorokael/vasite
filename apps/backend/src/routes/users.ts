// apps/backend/src/routes/users.ts
import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router: express.Router = express.Router();

// GET /api/users (admin only)
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
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/users/:id (admin only)
router.put('/:id', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: id as string  }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id as string  },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id (soft delete - add isActive field later)
// For now, we'll skip this and implement in MP6
router.delete('/:id', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // For MP5: Just return success (we'll implement soft delete in MP6)
    // We could also hard delete, but better to wait for proper soft delete
    res.status(204).send();
  } catch (error) {
    console.error('Error in user deletion:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;

// GET /api/users/:userId/addresses (admin only)
router.get('/:userId/addresses', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = req.params.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
    res.json({ addresses });
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// GET /api/users/:userId/orders (admin only)
router.get('/:userId/orders', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = req.params.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

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
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});