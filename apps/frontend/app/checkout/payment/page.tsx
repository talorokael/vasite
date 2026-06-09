'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutPaymentPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login?redirect=/checkout/address');
      return;
    }

    const initPayment = async () => {
      const addressId = sessionStorage.getItem('checkoutAddressId');
      if (!addressId) {
        toast.error('No shipping address selected. Please start over.');
        router.push('/checkout/address');
        return;
      }

      try {
        const { url } = await apiClient.fetch<{ url: string }>('/api/checkout/create-session', {
          method: 'POST',
          body: JSON.stringify({ addressId }),
        });
        // Redirect to Paystack payment page
        window.location.href = url;
      } catch (error: unknown) {
        console.error('Payment initiation error:', error);
        const message = error instanceof Error ? error.message : 'Failed to start payment. Please try again.';
        toast.error(message);
        router.push('/checkout/address');
      } finally {
        setLoading(false);
      }
    };

    if (user) initPayment();
  }, [user, authLoading, router]);

  if (loading) return <div className="p-8 text-center">Preparing checkout...</div>;

  return null;
}