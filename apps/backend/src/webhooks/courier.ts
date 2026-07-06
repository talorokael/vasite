import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';
import crypto from 'crypto';
import { Request, Response } from 'express';

export async function handleCourierWebhook(req: Request, res: Response) {
  try {
    const signature = (req.headers['x-shiplogic-signature'] as string) || '';
    const secret = process.env.TCG_WEBHOOK_SECRET;

    if (!secret) {
      logger.error('TCG webhook received but TCG_WEBHOOK_SECRET is not configured');
      return res.status(500).send('Webhook secret not configured');
    }

    const rawBody = req.body as Buffer;

    // Verify HMAC-SHA256 signature (hex or base64)
    const expectedHex = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const expectedBase64 = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');

    if (signature !== expectedHex && signature !== expectedBase64) {
      logger.warn({ signature, expectedHex }, 'Invalid TCG webhook signature');
      return res.status(401).send('Invalid signature');
    }

    const payload = JSON.parse(rawBody.toString('utf8'));

    // Expected payload shape (example): { tracking_number: 'TCG123', new_status: 'in_transit', event_time: '...' }
    const trackingNumber = payload.tracking_number || payload.tracking_reference || payload.trackingReference;
    const newStatus = payload.new_status || payload.status || payload.event;

    if (!trackingNumber) {
      logger.warn({ payload }, 'TCG webhook missing tracking number');
      return res.status(400).send('Missing tracking number');
    }

    // Update matching orders. Use updateMany in case multiple records exist.
    const update = await prisma.order.updateMany({
      where: { trackingNumber },
      data: {
        courierStatus: newStatus || undefined,
        courierUpdatedAt: new Date(),
      },
    });

    logger.info({ trackingNumber, newStatus, updated: update.count }, 'Processed TCG webhook');

    return res.status(200).send('OK');
  } catch (err: unknown) {
    logger.error({ err }, 'Error handling TCG webhook');
    return res.status(500).send('Webhook processing error');
  }
}
