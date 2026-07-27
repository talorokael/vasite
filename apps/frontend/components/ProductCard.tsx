// apps/frontend/components/ProductCard.tsx
'use client';

import Image from 'next/image';
import { useCart } from '@/lib/CartContext';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '@/lib/formatPrice';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    productType?: string;
    strainType?: string | null;
    images?: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  console.log('ProductCard price:', product.price, typeof product.price);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            {product.productType && (
              <span className="inline-block text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full mt-1">
                {product.productType}
              </span>
            )}
          </div>
          <p className="text-primary font-bold text-lg whitespace-nowrap">
            {formatPrice(product.price)}
          </p>
        </div>

        {product.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {product.strainType && (
          <div className="mb-3">
            <span className="text-xs text-muted-foreground">Strain: </span>
            <span className="text-sm text-foreground">{product.strainType}</span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Add ${product.name} to cart`}
        >
          {isAdding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}
