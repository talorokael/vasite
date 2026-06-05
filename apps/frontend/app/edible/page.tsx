import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { Cookie, Candy, Cake } from 'lucide-react';

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

const categories = [
  {
    icon: Candy,
    title: 'Gummies',
    description: 'Delicious fruit-flavored gummies with precise dosing for a consistent experience.',
  },
  {
    icon: Cookie,
    title: 'Chocolates',
    description: 'Rich, artisanal chocolates infused with premium African botanicals.',
  },
  {
    icon: Cake,
    title: 'Baked Goods',
    description: 'Fresh-baked treats made with natural ingredients and careful infusion.',
  },
];

export default function EdiblePage({ products }: PageProps) {
  const featuredProduct = products[0];
  const remainingProducts = products.slice(1, 9);

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance">
              Edible
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Indulge in our carefully crafted collection of edibles. Each product is 
              made with premium ingredients and precisely dosed for a reliable, 
              enjoyable experience.
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <article
                  key={category.title}
                  className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-3">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <Cookie className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground text-lg">
                No edibles available yet.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured Product */}
              {featuredProduct && (
                <div className="my-16">
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 text-center">
                    Featured Product
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-card rounded-lg border border-border overflow-hidden">
                    <div className="relative aspect-square lg:aspect-[4/3]">
                      {featuredProduct.images && featuredProduct.images[0] ? (
                        <Image
                          src={featuredProduct.images[0]}
                          alt={featuredProduct.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-8 lg:p-12">
                      {featuredProduct.productType && (
                        <span className="inline-block text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full mb-4">
                          {featuredProduct.productType}
                        </span>
                      )}
                      <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
                        {featuredProduct.name}
                      </h3>
                      {featuredProduct.description && (
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {featuredProduct.description}
                        </p>
                      )}
                      <p className="text-3xl font-bold text-primary mb-6">
                        ${(featuredProduct.price / 100).toFixed(2)}
                      </p>
                      <button
                        type="button"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-8 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining Products Grid */}
              {remainingProducts.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 text-center">
                    More Edibles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {remainingProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
