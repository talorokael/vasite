import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router: Router = Router();

// GET /api/admin/orders
router.get('/', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: { user: { select: { email: true, name: true } }, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);

    res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch('/:id/status', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const rawId = req.params.id;
    if (!rawId || Array.isArray(rawId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    const id = rawId;

    const { status } = req.body;
    const allowedStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating order status (admin):', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;