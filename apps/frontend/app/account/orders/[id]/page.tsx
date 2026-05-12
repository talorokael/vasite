'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient, Order } from '@/lib/api-client';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiClient.getOrder(id)
      .then(res => setOrder(res))
      .catch(err => {
        console.error(err);
        setError('Order not found or inaccessible');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading order details...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id.slice(-8)}</h1>
      <div className="bg-gray-50 p-4 rounded mb-4">
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Items</h2>
      <ul className="divide-y">
        {order.items.map((item) => (
          <li key={item.id} className="py-2 flex justify-between">
            <span>{item.product.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}