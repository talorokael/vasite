// app/cosmetics/page.tsx
import { fetchWithCookie } from '@/lib/fetch-with-cookie';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Sparkles } from 'lucide-react';

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
};

export default async function CosmeticsPage() {
  const categories = await fetchWithCookie<{ id: string; name: string }[]>('/api/categories');
  const targetCategoryNames = ['Hair', 'Body', 'Face'];
  const categoryIds = categories
    .filter(cat => targetCategoryNames.includes(cat.name))
    .map(cat => cat.id);

  const { products } = await fetchWithCookie<{ products: Product[] }>('/api/products?page=1&limit=200');
  const cosmeticsProducts = products.filter(p => categoryIds.includes(p.categoryId));

  const displayProducts = cosmeticsProducts.slice(0, 6);
  const hasMoreProducts = cosmeticsProducts.length > 6;

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x800/e8f5f0/004236" // ← REPLACE with your hero image
            alt="African natural cosmetics beauty background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
              <span className="text-primary-foreground/80 text-sm uppercase tracking-widest font-medium">
                Pure African Beauty
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6">
              Cosmetics
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Discover the beauty of Africa with our collection of natural cosmetics.
            </p>
          </div>
        </div>
      </section>

      {/* Three‑Step Ritual Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-foreground mb-12">
            Your Daily Ritual
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://placehold.co/300x300/e8f5f0/004236" // ← REPLACE with cleanse image
                  alt="Cleanse"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cleanse</h3>
              <p className="text-muted-foreground">Gentle botanical cleansers with African oils.</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://placehold.co/300x300/e8f5f0/004236" // ← REPLACE with tone image
                  alt="Tone & Hydrate"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tone & Hydrate</h3>
              <p className="text-muted-foreground">Natural toners infused with healing herbs.</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://placehold.co/300x300/e8f5f0/004236" // ← REPLACE with protect & glow image
                  alt="Protect & Glow"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Protect & Glow</h3>
              <p className="text-muted-foreground">Antioxidant‑rich moisturizers and serums.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">Featured Cosmetics</h2>
          {cosmeticsProducts.length === 0 ? (
            <div className="text-center py-16 bg-muted rounded-lg">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Our cosmetics collection is being prepared.</p>
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
                    href="/products?category=cosmetics"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    View All Cosmetic Products <span aria-hidden="true">&rarr;</span>
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