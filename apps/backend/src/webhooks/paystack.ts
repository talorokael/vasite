import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { prisma } from '../lib/prisma.js';
import { sendTransactionalEmail } from '../services/email.service.js';
// import { sendTransactionalSms } from '../services/sms.service.js';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET;

export const handlePaystackWebhook = async (req: Request, res: Response) => {
  console.log('🔔 WEBHOOK REACHED THE SERVER');

  // Get raw body as string
  const rawBody = (req.body as Buffer).toString('utf8');

  // Verify signature
  const signature = req.headers['x-paystack-signature'] as string;
  if (WEBHOOK_SECRET) {
    const hash = crypto
      .createHmac('sha512', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid webhook signature');
      return res.status(401).send('Unauthorized');
    }
  }

  const payload = JSON.parse(rawBody);
  const event = payload;

  if (event.event === 'charge.success') {
    const transaction = event.data;
    const reference = transaction.reference;
    const metadata = transaction.metadata;
    const userId = metadata?.userId;
    const shippingAddressId = metadata?.shippingAddressId;

    if (!userId) {
      console.error('No userId in webhook metadata');
      return res.status(400).send('Missing user ID');
    }

    // Verify transaction with Paystack API
    try {
      const verification = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
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

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      console.error('Cart is empty for user', userId);
      return res.status(400).send('Cart empty');
    }

    // Idempotency: check for existing order with this reference
    const existingOrder = await prisma.order.findFirst({
      where: {
        stripeSessionId: reference,
      },
    });

    if (existingOrder) {
      console.log(
        `Order already exists for reference ${reference}, skipping creation`
      );
      return res.status(200).json({
        received: true,
        duplicate: true,
      });
    }

    // Verify shipping address exists if provided (optional)
    let addressId: string | null = null;

    if (shippingAddressId) {
      const address = await prisma.address.findUnique({
        where: { id: shippingAddressId },
      });

      if (address) {
        addressId = address.id;
      } else {
        console.warn(
          `Shipping address ${shippingAddressId} not found`
        );
      }
    }

    // Create order with shipping address and items
    const order = await prisma.order.create({
      data: {
        userId,
        total: transaction.amount / 100,
        status: 'paid',
        stripeSessionId: reference,
        shippingAddressId: addressId,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // --- Send notifications ---
    try {
      // Fetch user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          name: true,
        },
      });

      // Fetch customer's default address (for SMS support)
      const defaultAddress = await prisma.address.findFirst({
        where: {
          userId,
          isDefault: true,
        },
        select: {
          phone: true,
        },
      });

      // Build items summary
      const itemsSummary = cart.items
        .map((i) => `${i.quantity}x ${i.product.name}`)
        .join(', ');

      // order.total is already stored in Rand
      const totalInRand = Number(order.total).toFixed(2);

      // --- Customer confirmation email ---
      const customerHtml = `
        <h1>Thank you for your order, ${user?.name || 'Customer'}! 🎉</h1>
        <p>Your order <strong>#${order.id}</strong> has been confirmed.</p>
        <p><strong>Total:</strong> R${totalInRand}</p>
        <p><strong>Items:</strong> ${itemsSummary}</p>
        <p>We'll notify you as soon as your order ships.</p>
      `;

      if (user?.email) {
        await sendTransactionalEmail({
          toEmail: user.email,
          toName: user.name ?? '',
          subject: `Order Confirmation #${order.id}`,
          htmlContent: customerHtml,
        });
      }

      // --- Admin notification email ---
      const adminHtml = `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${user?.email ?? 'Unknown'}</p>
        <p><strong>Total:</strong> R${totalInRand}</p>
        <p><strong>Items:</strong> ${itemsSummary}</p>
        <p><strong>Shipping Address ID:</strong> ${
          addressId || 'Not provided'
        }</p>
        <a href="${process.env.FRONTEND_URL}/admin/orders/${order.id}">
          View Order in Admin
        </a>
      `;

      if (process.env.ADMIN_EMAIL) {
        await sendTransactionalEmail({
          toEmail: process.env.ADMIN_EMAIL,
          subject: `New Order #${order.id}`,
          htmlContent: adminHtml,
        });
      }

      // --- Optional SMS ---
      // if (defaultAddress?.phone) {
      //   await sendTransactionalSms(
      //     defaultAddress.phone,
      //     `VerdeAfrique: Order #${order.id} confirmed. Total R${totalInRand}. We'll keep you updated.`
      //   );
      // }

      void defaultAddress;
    } catch (notifyError) {
      console.error(
        'Failed to send notifications, but order was created:',
        notifyError
      );
      // Do NOT throw – the order is already successful
    }

    // Clear the cart after successful order creation
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    console.log(
      `Order ${order.id} created, cart cleared for user ${userId}`
    );
  }

  res.sendStatus(200);
};