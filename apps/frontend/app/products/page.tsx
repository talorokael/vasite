// apps/frontend/app/products/page.tsx
import { apiClient } from '@/lib/api-client';
import ProductBrowser from '@/components/ProductBrowser';

export const metadata = {
  title: 'Products | VerdeAfrique',
  description: 'Browse our collection of premium African botanical products for hair, body, face, and more.',
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  
  let categories = [];
  let products = [];

  try {
    categories = await apiClient.getCategories();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }

  try {
    const response = await apiClient.getProducts({ page: 1, limit: 100 });
    products = response.products;
  } catch (error) {
    console.error('Failed to load products:', error);
  }

  // Filter by category name (case-insensitive) if provided
  const filteredProducts = category
    ? products.filter(
        (p: { categoryName?: string | null }) =>
          p.categoryName?.toLowerCase() === category.toLowerCase()
      )
    : products;

  return (
    <main className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
        </h1>
        <p className="text-muted-foreground">
          {category
            ? `Browse our selection of ${category.toLowerCase()} products.`
            : 'Discover our full collection of premium African botanical products.'}
        </p>
      </div>
      <ProductBrowser initialProducts={filteredProducts} categories={categories} />
    </main>
  );
}
