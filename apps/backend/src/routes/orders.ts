import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = Router();

// Helper to validate order ID parameter
function validateOrderId(id: unknown): string | null {
  if (!id || typeof id !== 'string') return null;
  return id;
}

// GET /api/orders – user's own orders
router.get('/', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const userId = req.user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
});

// GET /api/orders/:id – single order details
router.get('/:id', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  const orderId = validateOrderId(req.params.id);
  if (!orderId) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const userId = req.user.id;
  const isAdmin = req.user.role === 'ADMIN';

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: { select: { email: true, name: true } } },
  });

  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (!isAdmin && order.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

  res.json(order);
});

// Admin: GET all orders
router.get('/admin/orders', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

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
});

// Admin: Update order status
router.patch('/admin/orders/:id/status', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

  const orderId = validateOrderId(req.params.id);
  if (!orderId) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const { status } = req.body;
  const allowedStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  res.json(order);
});

export default router;