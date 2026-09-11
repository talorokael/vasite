// apps/frontend/app/account/orders/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient, Order } from '@/lib/api-client';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback';
import { ArrowLeft, Calendar, Hash, CreditCard, Loader2, AlertCircle } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiClient
      .getOrder(id)
      .then((res) => setOrder(res))
      .catch((err) => {
        console.error(err);
        setError('Order not found or inaccessible');
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-medium">{error}</p>
          <Link
            href="/account/orders"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
      {/* Back link */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Order #{order.id.slice(-8)}
            </h1>
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-2xl font-bold text-primary">
            ${(order.total / 100).toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Order ID:</span>
            <span className="font-mono text-foreground">{order.id.slice(-8)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Date:</span>
            <span className="text-foreground">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Items:</span>
            <span className="text-foreground">{order.items.length}</span>
          </div>
        </div>
      </div>

      {order.trackingNumber && (
        <section className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="font-semibold text-foreground">Shipment Tracking</h2>
            <span className="text-sm text-muted-foreground">
              {order.shipmentStatus ?? order.courierStatus ?? 'Pending'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {order.carrier ?? 'The Courier Guy'} tracking number:{' '}
            <a
              href={`https://www.thecourierguy.co.za/track/${encodeURIComponent(order.trackingNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              {order.trackingNumber}
            </a>
          </p>
          {order.waybillNumber && (
            <p className="mt-1 text-sm text-muted-foreground">Waybill: {order.waybillNumber}</p>
          )}
          {order.labelUrl && (
            <a
              href={order.labelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              Download shipping label
            </a>
          )}
          {order.trackingHistory && order.trackingHistory.length > 0 && (
            <ul className="mt-4 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
              {order.trackingHistory.map((event, index) => (
                <li key={`${event.timestamp ?? 'event'}-${index}`}>
                  {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Update'}: {event.status ?? event.event}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Order Items */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Order Items</h2>
        </div>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="p-4 flex gap-4">
              <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {item.product.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ${(item.price / 100).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Order Summary */}
        <div className="p-4 bg-muted border-t border-border">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">
              ${(order.total / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
