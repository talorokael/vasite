'use client';

import DebugAuth from './DebugAuth';
import ProductBrowser from './ProductBrowser';
import { Product, Category } from 'shared-types'
import Link from 'next/link';

interface HomePageClientProps {
  products: Product[];
  categories: Category[];
}

export default function HomePageClient({ products, categories }: HomePageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Debug component - only in dev */}
      <DebugAuth />
      
      <h1 className="text-3xl font-bold text-white-900 mb-2">VerdeAfrique</h1>
      <p className="text-white-600 mb-8">Premium cannabis products</p>
      
      {/* Auth Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-x-4 md:col-span-2 flex justify-end">
          <Link href="/login" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Login
          </Link>
          <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Register
          </Link>
        </div>
        
      </div>
      
      {/* Product Catalog Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white-900 mb-6">Product Catalog</h2>
        <ProductBrowser initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}