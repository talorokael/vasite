// apps/frontend/app/cart/page.tsx
'use client';

import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/lib/api-client';
import ImageWithFallback from '@/components/ImageWithFallback';
import EmptyState from '@/components/EmptyState';
import SkeletonCart from '@/components/SkeletonCart';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useState } from 'react';
import { Trash2, Minus, Plus, ShoppingBag, Loader2, CreditCard } from 'lucide-react';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem, cartCount } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    
    if (!user) {
      toast.error('Please login to checkout');
      return;
    }

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
    if (newQuantity < 1) return;
    
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await updateQuantity(itemId, newQuantity);
    } catch {
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await removeItem(itemId);
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  if (isLoading) return <SkeletonCart />;

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-card border border-border rounded-lg p-8">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart</h1>
            <p className="text-muted-foreground mb-6">
              Please login to view your cart and checkout.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven't added any items yet. Start exploring our products!"
        ctaText="Continue Shopping"
        ctaHref="/products"
      />
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
        Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 mb-8 lg:mb-0">
          {cart.items.map((item) => (
            <article
              key={item.id}
              className="bg-card border border-border rounded-lg p-4 flex gap-4"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                <ImageWithFallback
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate mb-1">
                  {item.product.name}
                </h3>
                <p className="text-primary font-bold">
                  ${(item.product.price / 100).toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                      {updatingItems.has(item.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 99 || updatingItems.has(item.id)}
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={updatingItems.has(item.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="font-bold text-foreground">
                  ${((item.product.price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-lg">
                <span>Total</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </>
              )}
            </button>

            <Link
              href="/products"
              className="block text-center text-primary hover:underline mt-4 text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
