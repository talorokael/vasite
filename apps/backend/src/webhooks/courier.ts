import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';
import { Request, Response } from 'express';

export async function handleCourierWebhook(req: Request, res: Response) {
  try {
    const secret = process.env.TCG_WEBHOOK_SECRET;
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    const rawBody = req.body as Buffer;

    if (secret) {
      if (!token || token !== secret) {
        logger.warn({ token: token ? 'present' : 'missing' }, 'Invalid TCG webhook token');
        return res.status(401).send('Invalid token');
      }
    } else {
      logger.warn('TCG_WEBHOOK_SECRET is not configured');
    }

    const payload = JSON.parse(rawBody.toString('utf8'));

    const event = payload.event;
    const data = payload.data || payload;
    const trackingNumber = data.tracking_number || data.tracking_reference || data.trackingReference;
    const newStatus = data.new_status || data.status || payload.event;

    if (!trackingNumber) {
      logger.warn({ payload }, 'TCG webhook missing tracking number');
      return res.status(400).send('Missing tracking number');
    }

    const orders = await prisma.order.findMany({ where: { trackingNumber } });
    const timestamp = new Date().toISOString();
    await Promise.all(orders.map((order) => {
      const history = Array.isArray(order.trackingHistory) ? order.trackingHistory : [];
      const updateData = {
        courierStatus: newStatus,
        shipmentStatus: newStatus,
        courierUpdatedAt: new Date(),
        trackingHistory: [...history, { event, status: newStatus, timestamp, raw: data }],
        ...(newStatus === 'DELIVERED' ? { status: 'delivered' } : {}),
      };

      return prisma.order.update({
        where: { id: order.id },
        data: updateData,
      });
    }));

    logger.info({ trackingNumber, newStatus, updated: orders.length }, 'Processed TCG webhook');

    return res.status(200).send('OK');
  } catch (err: unknown) {
    logger.error({ err }, 'Error handling TCG webhook');
    return res.status(500).send('Webhook processing error');
  }
}
