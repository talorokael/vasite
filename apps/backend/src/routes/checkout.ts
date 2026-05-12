import { Router } from 'express';
import axios from 'axios';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

router.post('/create-session', authenticate, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userId = req.user.id;

    // Get cart with items and products
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total in cents (kobo/cent equivalent)
    const totalCents = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) {
      return res.status(400).json({ error: 'User email not found' });
    }

    // Initialize Paystack transaction
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: totalCents,
        email: user.email,
        currency: 'ZAR',
        callback_url: `${FRONTEND_URL}/order/success`,
        metadata: {
          userId,
          cartId: cart.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { authorization_url, reference } = response.data.data;

    res.json({ url: authorization_url, reference });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

export default router;