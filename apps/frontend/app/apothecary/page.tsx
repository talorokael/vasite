// app/apothecary/page.tsx
import { fetchWithCookie } from '@/lib/fetch-with-cookie';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Flower2 } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  images?: string[];
  categoryName?: string | null;
};

export default async function ApothecaryPage() {
  const { products } = await fetchWithCookie<{ products: Product[] }>(
    '/api/products?page=1&limit=100&category=apothecary'
  );
  const displayProducts = products.slice(0, 6);
  const hasMoreProducts = products.length > 6;

  return (
    <main className="bg-background">
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/apothecary/Apothecary.jpg"
            alt="Apothecary herbal background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Flower2 className="w-8 h-8 text-primary-foreground" />
              <span className="text-primary-foreground/80 text-sm uppercase tracking-widest">
                Time‑Honored Remedies
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6">
              Apothecary
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Herbal remedies, tinctures, and wellness products rooted in African tradition.
            </p>
          </div>
        </div>
      </section>

      {/* Herbal Knowledge Split Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/apothecary/Herbal prep.jpg"
                alt="Herbal preparation with mortar and pestle"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Ancient Wisdom, Modern Wellness
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Rooibos</strong> – Antioxidant‑rich, supports digestive health.
                </li>
                <li>
                  <strong className="text-foreground">Devil&apos;s Claw</strong> – Anti‑inflammatory for joint comfort.
                </li>
                <li>
                  <strong className="text-foreground">Aloe & Honeybush</strong> – Soothing, hydrating, naturally sweet.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">Apothecary Products</h2>
          {products.length === 0 ? (
            <div className="text-center py-16 bg-muted rounded-lg">
              <Flower2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p>Apothecary products coming soon.</p>
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
                    href="/products?category=apothecary"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    View All Apothecary Products <span aria-hidden="true">&rarr;</span>
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