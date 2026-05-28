// apps/frontend/app/products/page.tsx
import { apiClient } from '@/lib/api-client';
import ProductBrowser from '@/components/ProductBrowser';
import { Category } from '@/types';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = await apiClient.getCategories();
  const { products } = await apiClient.getProducts({ page: 1, limit: 100 });

  // Filter by category name (case‑insensitive) if provided
  const filteredProducts = category
    ? products.filter((p) => p.categoryName?.toLowerCase() === category.toLowerCase())
    : products;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductBrowser initialProducts={filteredProducts} categories={categories} />
    </div>
  );
}