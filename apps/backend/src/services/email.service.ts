import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';

export async function sendTransactionalEmail({
  toEmail,
  toName,
  subject,
  htmlContent,
}: {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
}) {
  try {
    const response = await axios.post(
      `${BREVO_API_URL}/smtp/email`,
      {
        sender: {
          name: process.env.BREVO_EMAIL_FROM_NAME,
          email: process.env.BREVO_EMAIL_FROM,
        },
        to: [{ email: toEmail, name: toName }],
        subject,
        htmlContent,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Email sent to ${toEmail}:`, response.data.messageId);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Email sending failed:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('Email sending failed:', error.message);
    } else {
      console.error('Email sending failed:', error);
    }
    throw error;
  }
}

export async function sendShipmentEmail(
  order: { id: string; user: { email: string; name?: string | null } },
  shipment: { trackingNumber?: string; labelUrl?: string },
) {
  const trackingLink = `https://verdeafrique.co.za/account/orders/${encodeURIComponent(order.id)}`;
  const labelLink = shipment.labelUrl
    ? `<p><a href="${shipment.labelUrl}">Download shipping label</a></p>`
    : '';

  return sendTransactionalEmail({
    toEmail: order.user.email,
    ...(order.user.name ? { toName: order.user.name } : {}),
    subject: `Your order #${order.id} has been shipped`,
    htmlContent: `<h1>Your order is on its way</h1><p>Order #${order.id} has been shipped via The Courier Guy.</p><p><strong>Tracking number:</strong> ${shipment.trackingNumber ?? 'Pending'}</p><p><a href="${trackingLink}">Track your order</a></p>${labelLink}<p>Thank you for shopping with us.</p>`,
  });
}