import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { Sparkles, Droplets, Sun, Shield } from 'lucide-react';

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

const routineSteps = [
  {
    step: 1,
    icon: Sparkles,
    title: 'Cleanse',
    description: 'Remove impurities with our gentle botanical cleansers.',
  },
  {
    step: 2,
    icon: Droplets,
    title: 'Tone',
    description: 'Balance and prep your skin with natural toners.',
  },
  {
    step: 3,
    icon: Sun,
    title: 'Moisturize',
    description: 'Hydrate deeply with African plant-based moisturizers.',
  },
  {
    step: 4,
    icon: Shield,
    title: 'Protect',
    description: 'Shield your skin with antioxidant-rich formulas.',
  },
];

const filterChips = ['All', 'Hair', 'Body', 'Face'];

export default function CosmeticsPage({ products }: PageProps) {
  return (
    <main className="bg-background">
      {/* Full-Width Hero */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x900/004236/ffffff?text=Natural+African+Cosmetics"
            alt="Natural African cosmetics and beauty products"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-primary-foreground mb-6 text-balance">
            Cosmetics
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Discover the beauty of Africa with our collection of natural cosmetics. 
            Pure ingredients, sustainable practices, transformative results.
          </p>
        </div>
      </section>

      {/* Routine Steps */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Your Daily Ritual
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Build a complete skincare routine with our curated African botanical products.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {routineSteps.map((item) => {
              const IconComponent = item.icon;
              return (
                <article
                  key={item.step}
                  className="text-center space-y-4 group"
                >
                  <div className="relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary rounded-full flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:text-primary-foreground transition-colors" aria-hidden="true" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-full flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products with Filter Chips */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
              Shop Our Collection
            </h2>

            {/* Filter Chips - Visual Only */}
            <div className="flex flex-wrap justify-center gap-3 mb-12" role="group" aria-label="Product filters">
              {filterChips.map((chip, index) => (
                <button
                  key={chip}
                  type="button"
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    index === 0
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  aria-pressed={index === 0}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground text-lg">
                Our cosmetics collection is being prepared.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length > 0 && (
                <p className="text-center text-muted-foreground text-sm mt-8">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
