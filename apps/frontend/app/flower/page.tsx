import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Leaf } from 'lucide-react';

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

interface PageProps {
  products: Product[];
}

export default function FlowerPage({ products }: PageProps) {
  const displayProducts = products.slice(0, 6);
  const hasMoreProducts = products.length > 6;

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x800/004236/ffffff?text=Premium+African+Flower"
            alt="Premium African flower cultivation landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-8 h-8 text-primary-foreground" aria-hidden="true" />
              <span className="text-primary-foreground/80 text-sm uppercase tracking-widest font-medium">
                Cultivated with Care
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 text-balance">
              Premium African Flower
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl leading-relaxed">
              Discover our exceptional collection of sun-grown, hand-trimmed flower strains 
              sourced from the finest African cultivators. Each strain is carefully selected 
              for its unique terpene profile and potency.
            </p>
          </div>
        </div>
      </section>

      {/* Two-Column Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Text & Gallery */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  Our Cultivation Practices
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Organic Growing:</strong> Our flower is cultivated 
                    using only natural, organic methods. No synthetic pesticides or fertilizers 
                    are ever used in our growing process.
                  </p>
                  <p>
                    <strong className="text-foreground">Sun-Grown Excellence:</strong> We harness the power 
                    of the African sun to produce flower with rich cannabinoid and terpene profiles 
                    that indoor growing simply cannot match.
                  </p>
                  <p>
                    <strong className="text-foreground">Hand-Trimmed Quality:</strong> Every bud is carefully 
                    hand-trimmed by skilled artisans to preserve trichomes and ensure the 
                    highest quality final product.
                  </p>
                </div>
              </div>

              {/* Mini Gallery */}
              <div className="flex gap-4 justify-start">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src="https://placehold.co/200x200/e8f5f0/004236?text=Organic"
                    alt="Organic cultivation process"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src="https://placehold.co/200x200/e8f5f0/004236?text=Sun+Grown"
                    alt="Sun-grown flower fields"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src="https://placehold.co/200x200/e8f5f0/004236?text=Hand+Trim"
                    alt="Hand-trimming process"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Product Grid */}
            <div className="space-y-8">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                Featured Strains
              </h2>

              {products.length === 0 ? (
                <div className="text-center py-16 bg-muted rounded-lg">
                  <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                  <p className="text-muted-foreground text-lg">
                    No flower strains available yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {displayProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {hasMoreProducts && (
                    <div className="text-center pt-4">
                      <Link
                        href="/products?type=flower"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1"
                      >
                        View All Flower Products
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
