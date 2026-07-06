import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { createTCGShipment, trackTCGShipment } from '../services/tcg.service.js';
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

// POST /api/admin/orders/:orderId/ship
router.post('/:orderId/ship', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const rawId = req.params.orderId;
    if (!rawId || Array.isArray(rawId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    const id = rawId;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, shippingAddress: true, user: true },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!order.shippingAddress) return res.status(400).json({ error: 'No shipping address for order' });

    const items = order.items.map((it) => {
      const item: {
        quantity: number;
        price: number;
        description: string;
        weight: number;
        sku?: string;
      } = {
        quantity: it.quantity,
        price: it.price,
        description: it.product?.name ?? 'Item',
        weight: it.product?.weight ?? 0,
      };

      if (it.product?.sku) {
        item.sku = it.product.sku;
      }

      return item;
    });

    const customerName = order.user.name ?? 'Customer';
    const shipment = await createTCGShipment(
      {
        id: order.id,
        user: {
          name: customerName,
        },
      },
      {
        name: order.shippingAddress?.name ?? customerName,
        street: order.shippingAddress?.street ?? '',
        city: order.shippingAddress?.city ?? '',
        postalCode: order.shippingAddress?.postalCode ?? '',
        country: order.shippingAddress?.country ?? 'South Africa',
        phone: order.shippingAddress?.phone ?? '',
      },
      items
    );

    const updateData: Prisma.OrderUpdateInput = {
      courierUpdatedAt: new Date(),
    };

    if (shipment.trackingNumber) {
      updateData.trackingNumber = shipment.trackingNumber;
      updateData.courierStatus = 'pending';
    }

    await prisma.order.update({
      where: { id },
      data: updateData,
    });

    res.json({ trackingNumber: shipment.trackingNumber, labelUrl: shipment.labelUrl, raw: shipment.raw });
  } catch (error) {
    console.error('Error creating shipment (admin):', error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// GET /api/admin/orders/:orderId/track - temporary admin test endpoint
router.get('/:orderId/track', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const rawId = req.params.orderId;
    if (!rawId || Array.isArray(rawId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    const id = rawId;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!order.trackingNumber) return res.status(400).json({ error: 'Order has no tracking number' });

    const tracking = await trackTCGShipment(order.trackingNumber);
    res.json({ tracking });
  } catch (err) {
    console.error('Error tracking shipment (admin):', err);
    res.status(500).json({ error: 'Failed to fetch tracking info' });
  }
});

export default router;
