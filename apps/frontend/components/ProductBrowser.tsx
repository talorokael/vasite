// apps/frontend/components/ProductBrowser.tsx
'use client';

import ImageWithFallback from './ImageWithFallback';
import useSWR from 'swr';
import { useState } from 'react';
import { Product, Category } from '../types';
import CategoryFilter from './CategoryFilter';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import toast from 'react-hot-toast';
import SkeletonProductGrid from './SkeletonProductGrid';
import EmptyState from './EmptyState';
import { ShoppingCart, Eye, Loader2 } from 'lucide-react';

interface ProductBrowserProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductBrowser({ initialProducts, categories }: ProductBrowserProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const shouldFetch = initialProducts.length === 0;
  const { data: products = initialProducts, error, isLoading } = useSWR<Product[]>(
    shouldFetch ? '/api/products' : null,
    async () => {
      const result = await apiClient.getProducts({ page: 1, limit: 100 });
      return result.products;
    },
    { fallbackData: initialProducts }
  );

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      await addToCart(productId, 1);
    } catch (err) {
      toast.error('Failed to add item');
      console.error(err);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/products/${id}`);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive font-medium">Failed to load products</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) return <SkeletonProductGrid />;

  const filteredProducts = selectedCategoryId
    ? products.filter((product) => product.categoryId === selectedCategoryId)
    : products;

  if (filteredProducts.length === 0) {
    return (
      <div className="space-y-8">
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <EmptyState
          title="No products found"
          description={
            selectedCategoryId
              ? "This category doesn't have any products yet. Try another category."
              : 'No products are available at the moment. Please check back later.'
          }
          ctaText={selectedCategoryId ? 'Clear filter' : undefined}
          ctaHref={selectedCategoryId ? '#' : undefined}
        />
        {selectedCategoryId && (
          <div className="text-center">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="text-primary hover:underline font-medium"
            >
              Clear category filter
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />
      
      <p className="text-muted-foreground text-sm">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="relative w-full aspect-square bg-muted overflow-hidden">
              <ImageWithFallback
                src={product.images?.[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-1 truncate">{product.name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3 min-h-[2.5rem]">
                {product.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-bold text-primary text-lg">
                  ${(product.price / 100).toFixed(2)}
                </span>
                {product.categoryName && (
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {product.categoryName}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingToCart === product.id}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Add ${product.name} to cart`}
                >
                  {addingToCart === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  Add
                </button>
                <button
                  onClick={() => handleViewDetails(product.id)}
                  className="px-4 py-2.5 border border-border hover:bg-muted text-foreground rounded-md text-sm font-medium transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`View details for ${product.name}`}
                >
                  <Eye className="w-4 h-4" />
                  Details
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}