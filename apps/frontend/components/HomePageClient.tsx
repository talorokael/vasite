'use client';

import DebugAuth from './DebugAuth';
import ProductBrowser from './ProductBrowser';
import { Product, Category } from 'shared-types'


interface HomePageClientProps {
  products: Product[];
  categories: Category[];
}

export default function HomePageClient({ products, categories }: HomePageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Debug component - only in dev */}
      <DebugAuth />
      
      
      
      
      {/* Product Catalog Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white-900 mb-6">Product Catalog</h2>
        <ProductBrowser initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}