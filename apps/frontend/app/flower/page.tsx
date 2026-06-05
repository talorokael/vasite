import { cookies } from 'next/headers';
import ProductCard from '@/components/ProductCard';

type Product = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string | null;
  productType?: string;
  strainType?: string | null;
  images?: string[];
  [key: string]: unknown;
};

async function fetchWithCookie(endpoint: string) {
  const cookieStore = await cookies();
  let cookieHeader = '';

  cookieStore.getAll().forEach((cookie) => {
    cookieHeader += `${cookie.name}=${cookie.value}; `;
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: { Cookie: cookieHeader },
  });

  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);

  return res.json();
}

export default async function FlowerPage() {
  const { products } = (await fetchWithCookie(
    '/api/products?page=1&limit=200'
  )) as { products: Product[] };

  const flowerProducts = products.filter(
    (p: Product) => p.productType === 'FLOWER'
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Flower</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Premium dried flower strains – sativa, indica, and hybrid. Grown with
          care in Africa.
        </p>
      </div>

      {flowerProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          No flower products available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {flowerProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}