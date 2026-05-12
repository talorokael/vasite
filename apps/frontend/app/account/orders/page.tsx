'use client';
import { useEffect, useState } from 'react';
import { apiClient, Order } from '@/lib/api-client';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getOrders()
      .then(res => setOrders(res.orders))
      .catch(err => {
        console.error(err);
        setError('Failed to load orders');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-semibold">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm capitalize">
                    Status:{' '}
                    <span className={`font-medium ${
                      order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                  <Link href={`/account/orders/${order.id}`} className="text-blue-600 text-sm hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}