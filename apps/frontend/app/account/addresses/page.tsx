'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

type Address = {
  id: string;
  name: string | null;
  street: string;
  city: string;
  postalCode: string | null;
  country: string | null;
  phone: string | null;
  isDefault: boolean;
};

export default function AddressesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const data = await apiClient.fetch<Address[]>('/api/address');
      setAddresses(data);
    } catch (err) {
      console.error('Failed to load addresses', err);
      toast.error('Could not load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login?redirect=/account/addresses');
      return;
    }
    if (user) fetchAddresses();
  }, [user, authLoading]);

  const handleSetDefault = async (id: string) => {
    try {
      const address = addresses.find((a) => a.id === id);
      if (!address) return;
      await apiClient.fetch(`/api/address/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...address, isDefault: true }),
      });
      toast.success('Default address updated');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to set default address');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await apiClient.fetch(`/api/address/${id}`, { method: 'DELETE' });
      toast.success('Address deleted');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  if (authLoading || loading) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Link
          href="/account/addresses/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Add New Address
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-4">You have not saved any addresses yet.</p>
          <Link href="/account/addresses/new" className="text-primary hover:underline">
            Add your first address
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border rounded-lg p-4 flex flex-wrap justify-between items-start">
              <div>
                <p className="font-semibold">{addr.name || 'Address'}</p>
                <p className="text-sm">{addr.street}</p>
                <p className="text-sm">{addr.city}, {addr.postalCode}</p>
                <p className="text-sm">{addr.country}</p>
                <p className="text-sm text-muted-foreground">Phone: {addr.phone || '-'}</p>
                {addr.isDefault && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Default</span>
                )}
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    Set as default
                  </button>
                )}
                <Link
                  href={`/account/addresses/${addr.id}/edit`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
