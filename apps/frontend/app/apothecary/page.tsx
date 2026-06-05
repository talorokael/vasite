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
  categoryName?: string | null;
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

export default async function ApothecaryPage() {
  const { products } = (await fetchWithCookie(
    '/api/products?page=1&limit=200'
  )) as { products: Product[] };

  const apothecaryProducts = products.filter(
    (p: Product) => p.categoryName?.toLowerCase() === 'apothecary'
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Apothecary</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Herbal remedies, tinctures, and wellness products rooted in African
          botanical traditions.
        </p>
      </div>

      {apothecaryProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          No apothecary products available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apothecaryProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}