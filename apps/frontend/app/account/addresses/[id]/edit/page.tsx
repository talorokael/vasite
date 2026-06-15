'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditAddressPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push(`/login?redirect=/account/addresses/${id}/edit`);
      return;
    }
    if (user) {
      const fetchAddress = async () => {
        try {
          const addresses = await apiClient.fetch<Address[]>('/api/address');
          const found = addresses.find((a) => a.id === id);
          if (found) setForm(found);
          else toast.error('Address not found');
        } catch (err) {
          toast.error('Failed to load address');
        } finally {
          setLoading(false);
        }
      };
      fetchAddress();
    }
  }, [id, user, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!form) return;
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev!,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSubmitting(true);
    try {
      await apiClient.fetch(`/api/address/${id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      toast.success('Address updated');
      router.push('/account/addresses');
    } catch (err) {
      toast.error('Failed to update address');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <div className="p-6">Loading...</div>;
  if (!form) return <div className="p-6">Address not found</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Address</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Address name</label>
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Street address</label>
          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Postal code</label>
          <input
            name="postalCode"
            value={form.postalCode || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <select
            name="country"
            value={form.country || 'South Africa'}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option>South Africa</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone number</label>
          <input
            name="phone"
            value={form.phone || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
          />
          Set as default address
        </label>
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Update Address'}
          </button>
        </div>
      </form>
    </div>
  );
}
