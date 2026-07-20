// app/flower/page.tsx
import { fetchWithCookie } from '@/lib/fetch-with-cookie';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Leaf } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  images?: string[];
  productType?: string;
};

export default async function FlowerPage() {
  const { products } = await fetchWithCookie<{ products: Product[] }>('/api/products?page=1&limit=200');
  const flowerProducts = products.filter(p => p.productType === 'FLOWER');
  const displayProducts = flowerProducts.slice(0, 6);
  const hasMoreProducts = flowerProducts.length > 6;

  return (
    <main className="bg-background">
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/flower/Flower.jpg"
            alt="Premium African flower background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-8 h-8 text-primary-foreground" />
              <span className="text-primary-foreground/80 text-sm uppercase tracking-widest">
                Cultivated with Care
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6">
              Premium African Flower
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Sun‑grown, hand‑trimmed strains from the finest African cultivators.
            </p>
          </div>
        </div>
      </section>

      {/* Strain Showcase */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-foreground mb-12">
            Explore Our Strains
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative h-80 rounded-xl overflow-hidden group">
              <Image
                src="https://placehold.co/600x800/e8f5f0/004236" // ← REPLACE with Sativa image
                alt="Sativa strain"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-serif">Sativa</h3>
              </div>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden group">
              <Image
                src="https://placehold.co/600x800/e8f5f0/004236" // ← REPLACE with Indica image
                alt="Indica strain"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-serif">Indica</h3>
              </div>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden group">
              <Image
                src="https://placehold.co/600x800/e8f5f0/004236" // ← REPLACE with Hybrid image
                alt="Hybrid strain"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-serif">Hybrid</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">Featured Strains</h2>
          {flowerProducts.length === 0 ? (
            <div className="text-center py-16 bg-muted rounded-lg">
              <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p>No flower strains available yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {hasMoreProducts && (
                <div className="text-center pt-4">
                  <Link
                    href="/products?type=flower"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    View All Flower Products <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}