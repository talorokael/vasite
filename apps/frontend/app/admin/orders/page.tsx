'use client';
import { useEffect, useState } from 'react';
import { apiClient, AdminOrder } from '@/lib/api-client';

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    apiClient.getAllOrders()
      .then(res => setOrders(res.orders))
      .catch(err => {
        console.error(err);
        setError('Failed to load orders. Make sure you are logged in as admin.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await apiClient.updateOrderStatus(orderId, newStatus);
      fetchOrders(); // refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Order ID</th>
              <th className="py-2 px-4 border">Customer</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="text-center">
                <td className="py-2 px-4 border">{order.id.slice(-8)}</td>
                <td className="py-2 px-4 border">{order.user.email}</td>
                <td className="py-2 px-4 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">${order.total.toFixed(2)}</td>
                <td className="py-2 px-4 border capitalize">{order.status}</td>
                <td className="py-2 px-4 border">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="border rounded p-1 text-sm"
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}