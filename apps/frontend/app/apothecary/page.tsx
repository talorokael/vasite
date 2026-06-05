import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { Flower2 } from 'lucide-react';

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

interface PageProps {
  products: Product[];
}

const ingredients = [
  {
    name: 'Rooibos',
    description: 'A caffeine-free herb rich in antioxidants, traditionally used for digestive health and skin wellness.',
    image: 'https://placehold.co/120x120/e8f5f0/004236?text=Rooibos',
  },
  {
    name: "Devil's Claw",
    description: 'Known for its anti-inflammatory properties, used traditionally to support joint and muscle comfort.',
    image: 'https://placehold.co/120x120/e8f5f0/004236?text=Devil%27s+Claw',
  },
  {
    name: 'Aloe',
    description: 'A versatile succulent prized for its soothing and hydrating properties for skin and digestive health.',
    image: 'https://placehold.co/120x120/e8f5f0/004236?text=Aloe',
  },
  {
    name: 'Honeybush',
    description: 'A naturally sweet herb with calming properties, often used to support respiratory health.',
    image: 'https://placehold.co/120x120/e8f5f0/004236?text=Honeybush',
  },
];

const filterCategories = [
  'All Products',
  'Tinctures',
  'Balms & Salves',
  'Teas & Infusions',
  'Capsules',
  'Oils',
];

export default function ApothecaryPage({ products }: PageProps) {
  return (
    <main className="bg-background">
      {/* Split Hero Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <div className="space-y-6">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground text-balance">
                Apothecary
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Discover the healing power of African botanicals. Our apothecary 
                collection features traditional herbal remedies, tinctures, and 
                wellness products crafted from time-honored recipes passed down 
                through generations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Each product is carefully formulated using sustainably sourced 
                ingredients and traditional preparation methods to preserve their 
                natural efficacy.
              </p>
            </div>

            {/* Right - Image */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="https://placehold.co/800x600/004236/ffffff?text=African+Botanicals"
                alt="Collection of African botanical herbs and remedies"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ingredient Spotlight */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Featured Ingredients
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our products harness the power of Africa&apos;s most treasured botanicals, 
              each with unique properties developed over millennia.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ingredients.map((ingredient) => (
              <article key={ingredient.name} className="text-center space-y-4">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden border-2 border-primary/20 bg-card">
                  <Image
                    src={ingredient.image}
                    alt={ingredient.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {ingredient.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ingredient.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Products with Sidebar */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Visual Only */}
            <aside className="lg:w-1/4 shrink-0">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <nav aria-label="Product categories">
                  <ul className="space-y-2">
                    {filterCategories.map((category, index) => (
                      <li key={category}>
                        <button
                          type="button"
                          className={`w-full text-left px-4 py-2 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            index === 0
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                          aria-pressed={index === 0}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                  Our Products
                </h2>
                {products.length > 0 && (
                  <p className="text-muted-foreground text-sm">
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {products.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-lg border border-border">
                  <Flower2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                  <p className="text-muted-foreground text-lg">
                    Apothecary products coming soon.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
