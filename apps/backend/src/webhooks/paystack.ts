import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { prisma } from '../lib/prisma.js';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET; // optional but recommended

export const handlePaystackWebhook = async (req: Request, res: Response) => {
  console.log('🔔 WEBHOOK REACHED THE SERVER');
  // Verify signature if webhook secret is set
  const signature = req.headers['x-paystack-signature'] as string;
  if (WEBHOOK_SECRET) {
    const hash = crypto
      .createHmac('sha512', WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');
    if (hash !== signature) {
      console.error('Invalid webhook signature');
      return res.status(401).send('Unauthorized');
    }
  }

  const event = req.body;
  if (event.event === 'charge.success') {
    const transaction = event.data;
    const reference = transaction.reference;
    const metadata = transaction.metadata;
    const userId = metadata?.userId;

    if (!userId) {
      console.error('No userId in webhook metadata');
      return res.status(400).send('Missing user ID');
    }

    // Verify transaction with Paystack API (extra security)
    try {
      const verification = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        }
      );
      if (verification.data.data.status !== 'success') {
        console.error('Transaction verification failed');
        return res.status(400).send('Transaction not successful');
      }
    } catch (err) {
      console.error('Verification request failed', err);
      return res.status(400).send('Verification failed');
    }

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      console.error('Cart is empty for user', userId);
      return res.status(400).send('Cart empty');
    }

    // Create order – reuse stripeSessionId field for Paystack reference
    const order = await prisma.order.create({
      data: {
        userId,
        total: transaction.amount / 100, // convert from cents
        status: 'paid',
        stripeSessionId: reference, // store Paystack reference
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Clear the cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    console.log(`Order ${order.id} created, cart cleared for user ${userId}`);
  }

  res.sendStatus(200);
};