"use client";

import { useCart } from "@/lib/CartContext";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem, cartCount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const { url } = await apiClient.createCheckoutSession();
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading cart...</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link href="/" className="text-green-600 underline mt-4 inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({cartCount} items)</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 flex gap-4 items-center">
            {item.product.images?.[0] && (
              <div className="relative w-20 h-20">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-gray-600">${(item.product.price / 100).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {[...Array(10).keys()].map((n) => (
                  <option key={n + 1} value={n + 1}>{n + 1}</option>
                ))}
              </select>
              <button
                onClick={() => removeItem(item.id)}
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
          {isCheckingOut ? "Redirecting..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}