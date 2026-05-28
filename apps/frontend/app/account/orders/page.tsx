// apps/frontend/app/account/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient, Order } from '@/lib/api-client';
import Link from 'next/link';
import { Package, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .getOrders()
      .then((res) => setOrders(res.orders))
      .catch((err) => {
        console.error(err);
        setError('Failed to load orders');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-primary/10 text-primary';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600';
      case 'cancelled':
      case 'failed':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          My Orders
        </h1>
        <p className="text-muted-foreground">
          View and track your order history
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No orders yet
          </h2>
          <p className="text-muted-foreground mb-6">
            When you place an order, it will appear here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-card border border-border rounded-lg p-4 lg:p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-foreground">
                      Order #{order.id.slice(-8)}
                    </p>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6">
                  <p className="text-xl font-bold text-foreground">
                    ${(order.total / 100).toFixed(2)}
                  </p>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/account"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Account
        </Link>
      </div>
    </main>
  );
}
