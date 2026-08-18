// app/edible/page.tsx
import { fetchWithCookie } from '@/lib/fetch-with-cookie';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Cookie } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  images?: string[];
  productType?: string;
};

export default async function EdiblePage() {
  const { products } = await fetchWithCookie<{ products: Product[] }>('/api/products?page=1&limit=200');
  const edibleProducts = products.filter(p => p.productType === 'EDIBLE');
  const displayProducts = edibleProducts.slice(0, 6);
  const hasMoreProducts = edibleProducts.length > 6;

  return (
    <main className="bg-background">
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/edibles/Edibles 2.jpeg"
            alt="Artisanal edibles background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Cookie className="w-8 h-8 text-primary-foreground" />
              <span className="text-primary-foreground/80 text-sm uppercase tracking-widest">
                Indulge Responsibly
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6">
              Edible
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Artisanal edibles made with premium ingredients, precisely dosed.
            </p>
          </div>
        </div>
      </section>

      {/* Edible Categories Gallery */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/edibles/gum.jpg"
                alt="Gummies"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/edibles/choc.jpg"
                alt="Chocolates"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/edibles/Baked.jpg"
                alt="Baked Goods"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">Featured Edibles</h2>
          {edibleProducts.length === 0 ? (
            <div className="text-center py-16 bg-muted rounded-lg">
              <Cookie className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p>No edibles available yet.</p>
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
                    href="/products?type=edible"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    View All Edible Products <span aria-hidden="true">&rarr;</span>
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