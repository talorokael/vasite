'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductBrowser from './ProductBrowser';
import { Product, Category } from 'shared-types';
import { ArrowRight, Leaf, Sparkles, Heart } from 'lucide-react';

interface HomePageClientProps {
  products: Product[];
  categories: Category[];
}

export default function HomePageClient({ products, categories }: HomePageClientProps) {
  // Get first 6 products for featured section
  const featuredProducts = products.slice(0, 6);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 lg:py-32 overflow-hidden min-h-[500px] flex items-center">
        {/* Full-cover background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/Apothecary.jpg"
            alt="African botanicals hero"
            fill
            className="object-cover"
            priority
          />
          {/* Soft overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content – left aligned, soft, minimal */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 mb-4 leading-tight">
              Naturally African,<br />Globally Loved
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-xl mb-6 leading-relaxed">
              Premium skincare, body, and beauty products inspired by African botanicals.
              Pure ingredients, sustainable sourcing, transformative results.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2.5 rounded-md font-medium hover:bg-white/20 transition-all"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-white/30 text-white/80 px-6 py-2.5 rounded-md font-medium hover:bg-white/10 transition-all"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Event Banner – full width */}
<section className="w-full bg-primary">
  <div className="relative w-full" style={{ aspectRatio: '16/12' }}>
    <Image
      src="/images/event1.jpg"
      alt="Agro-Processing Africa Summit 2026"
      fill
      className="object-contain"
      priority
    />
  </div>
</section>

      {/* Featured Products Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Featured Products</h2>
          <Link 
            href="/products" 
            className="text-primary hover:underline font-medium flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductBrowser initialProducts={featuredProducts} categories={categories} />
      </section>

      {/* Categories CTA */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-secondary-foreground mb-4">
            Explore Our Collections
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            From nourishing hair care to revitalizing skincare, find the perfect products for your wellness journey.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Hair', 'Body', 'Face', 'Flower', 'Edible', 'Apothecary'].map((category) => (
              <Link
                key={category}
                href={`/products?category=${category.toLowerCase()}`}
                className="px-6 py-2 bg-card text-foreground rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
