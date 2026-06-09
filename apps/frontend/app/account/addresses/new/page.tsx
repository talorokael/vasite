'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function NewAddressPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'South Africa',
    phone: '',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.fetch('/api/address', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      toast.success('Address saved');
      router.push('/checkout/address');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Address</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Address name (e.g., Home)" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="street" placeholder="Street address" value={form.street} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="postalCode" placeholder="Postal code" value={form.postalCode} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" required />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
          Set as default address
        </label>
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? 'Saving...' : 'Save Address'}
        </button>
      </form>
    </div>
  );
}