// apps/frontend/app/about/page.tsx
import { Leaf, Heart, Globe, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | VerdeAfrique',
  description: 'Learn about VerdeAfrique - premium African botanicals for skincare and wellness',
};

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: 'Natural Ingredients',
      description:
        'We source only the finest botanical ingredients directly from African farms, ensuring purity and potency in every product.',
    },
    {
      icon: Heart,
      title: 'Community First',
      description:
        'We partner with local farmers and communities, providing fair wages and supporting sustainable agricultural practices.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description:
        'From Africa to the world, we bring the best of African botanicals to customers everywhere while maintaining our roots.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description:
        'Every product undergoes rigorous testing to ensure it meets our high standards for safety, efficacy, and quality.',
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Our Story
          </h1>
          <p className="text-lg lg:text-xl max-w-2xl mx-auto opacity-90 text-pretty">
            VerdeAfrique is dedicated to bringing the power of African botanicals 
            to the world through premium skincare, body, and beauty products.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 text-center">
            Our Mission
          </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              At VerdeAfrique, we believe in the transformative power of nature. 
              Our mission is to support sustainable enterprise, cannabis/hemp businesses and natural product development, while andancing disablity inclusion.
            </p>
            <p className="text-lg leading-relaxed">
              Every product in our collection is carefully crafted using traditional knowledge 
              combined with modern science to deliver visible, lasting results.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-12 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
          Ready to Experience the Difference?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Discover our collection of premium African botanicals and start your 
          journey to natural beauty and wellness.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          Shop Our Collection
        </Link>
      </section>
    </main>
  );
}
