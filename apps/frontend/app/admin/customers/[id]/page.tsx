"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

type Address = {
  id: string;
  name?: string | null;
  street: string;
  city: string;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
  isDefault: boolean;
};

type OrderRow = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    const load = async () => {
      setLoading(true);
      try {
        const [addrRes, ordRes] = await Promise.all([
          apiClient.getAdminUserAddresses(id),
          apiClient.getAdminUserOrders(id),
        ]);
        setAddresses(addrRes.addresses || []);
        setOrders(ordRes.orders || []);
      } catch (err) {
        console.error('Failed to load customer data:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user]);

  if (!user || user.role !== 'ADMIN') return <div className="p-6">Unauthorized</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Details</h1>
        <div>
          <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:underline">Back</button>
        </div>
      </div>

      {loading ? (
        <div className="p-6">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Addresses</h2>
            {addresses.length === 0 ? (
              <p className="text-muted-foreground">No saved addresses.</p>
            ) : (
              <ul className="space-y-3">
                {addresses.map(a => (
                  <li key={a.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{a.name || 'Address'}</p>
                        <p className="text-sm text-muted-foreground">{a.street}</p>
                        <p className="text-sm">{a.city}, {a.postalCode}</p>
                        <p className="text-sm">{a.country}</p>
                        <p className="text-sm text-muted-foreground">Phone: {a.phone || '-'}</p>
                      </div>
                      <div className="text-right">
                        {a.isDefault && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Default</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Orders</h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">No orders placed.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-sm text-muted-foreground">
                      <th className="px-3 py-2">Order</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-t">
                        <td className="px-3 py-3">{o.id}</td>
                        <td className="px-3 py-3">{new Date(o.createdAt).toLocaleString()}</td>
                        <td className="px-3 py-3">${(o.total/100).toFixed(2)}</td>
                        <td className="px-3 py-3 capitalize">{o.status}</td>
                        <td className="px-3 py-3">
                          <Link href={`/admin/orders`} className="text-primary hover:underline">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
