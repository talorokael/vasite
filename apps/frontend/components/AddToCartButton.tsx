'use client';

import { useCart } from '@/lib/CartContext';
import { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';

export default function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);
    try {
      await addToCart(productId, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdding}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {isAdding ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  );
}
