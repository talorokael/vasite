'use client';

import { useCart } from '@/lib/CartContext';
import { apiClient } from '@/lib/api-client';
import ImageWithFallback from '@/components/ImageWithFallback';
import EmptyState from '@/components/EmptyState';
import SkeletonCart from '@/components/SkeletonCart';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem, cartCount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const { url } = await apiClient.createCheckoutSession();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
      // Toast is already inside updateQuantity in CartContext
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
      // Toast is already inside removeItem in CartContext
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) return <SkeletonCart />;

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven't added any items yet."
        ctaText="Continue shopping"
        ctaHref="/products"
      />
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({cartCount} items)</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 flex gap-4 items-center flex-wrap sm:flex-nowrap">
            <div className="relative w-20 h-20 flex-shrink-0">
              <ImageWithFallback
                src={item.product.images?.[0]}
                alt={item.product.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{item.product.name}</h3>
              <p className="text-gray-600">${(item.product.price / 100).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {[...Array(10).keys()].map((n) => (
                  <option key={n + 1} value={n + 1}>{n + 1}</option>
                ))}
              </select>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-xl font-bold">Total: ${(total / 100).toFixed(2)}</p>
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isCheckingOut ? 'Redirecting...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}