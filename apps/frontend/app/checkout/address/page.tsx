'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export default function CheckoutAddressPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user's addresses
  useEffect(() => {
    if (!user) return;
    const fetchAddresses = async () => {
      try {
        const data = await apiClient.fetch<Address[]>('/api/address');
        setAddresses(data);
        const defaultAddr = data.find(a => a.isDefault);
        if (defaultAddr) setSelectedId(defaultAddr.id);
      } catch (error) {
        console.error('Failed to load addresses:', error);
        toast.error('Could not load addresses');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [user]);

  const handleSelect = (id: string) => setSelectedId(id);

  const handleProceed = async () => {
    if (!selectedId) {
      toast.error('Please select a shipping address');
      return;
    }
    setSubmitting(true);
    try {
      // Store the selected address ID in sessionStorage (or pass via query param)
      sessionStorage.setItem('checkoutAddressId', selectedId);
      router.push('/checkout/payment');
    } catch (error) {
      console.error(error);
      toast.error('Failed to proceed');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <div className="p-8 text-center">Please log in to checkout.</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Shipping Address</h1>

      {addresses.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <p className="mb-4">You do not have any saved addresses.</p>
          <button
            onClick={() => router.push('/account/addresses/new')}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add New Address
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedId === addr.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleSelect(addr.id)}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedId === addr.id}
                    onChange={() => handleSelect(addr.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold">{addr.name}</p>
                    <p className="text-gray-600">{addr.street}</p>
                    <p>{addr.city}, {addr.postalCode}</p>
                    <p>{addr.country}</p>
                    <p className="text-sm text-gray-500">Phone: {addr.phone}</p>
                    {addr.isDefault && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Default</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => router.push('/account/addresses/new')}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
            >
              + Add New Address
            </button>
            <button
              onClick={handleProceed}
              disabled={!selectedId || submitting}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}