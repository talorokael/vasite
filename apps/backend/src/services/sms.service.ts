import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';

export async function sendTransactionalSms(phoneNumber: string, message: string) {
  try {
    const response = await axios.post(
      `${BREVO_API_URL}/transactionalSMS/sms`,
      {
        sender: process.env.BREVO_SMS_SENDER || 'VerdeAfr',
        recipient: phoneNumber,
        content: message,
        type: 'transactional',
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`SMS sent to ${phoneNumber}:`, response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('SMS sending failed:', error.response?.data || error.message);
    } else {
      console.error('SMS sending failed:', error);
    }
    throw error;
  }
}