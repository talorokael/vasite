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

interface ProductBrowserProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductBrowser({ initialProducts, categories }: ProductBrowserProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { data: products = initialProducts, error, isLoading } = useSWR<Product[]>(
    '/api/products',
    async () => {
      const result = await apiClient.getProducts({ page: 1, limit: 100 });
      return result.products;
    },
    { fallbackData: initialProducts }
  );

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add item');
      console.error(err);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/products/${id}`);
  };

  if (error) return <div className="text-red-600">Failed to load products</div>;
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
              : "No products are available at the moment. Please check back later."
          }
          ctaText={selectedCategoryId ? "Clear filter" : undefined}
          ctaHref={selectedCategoryId ? "#" : undefined}
        />
        {selectedCategoryId && (
          <div className="text-center">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="text-green-600 hover:text-green-700 underline"
            >
              Clear category filter
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />
      <p className="text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="relative w-full h-48 mb-3">
              <ImageWithFallback
                src={product.images?.[0]}
                alt={product.name}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h3 className="font-medium text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center gap-2">
              <span className="font-bold text-green-700">
                ${(product.price / 100).toFixed(2)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleViewDetails(product.id)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}