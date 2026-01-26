// apps/frontend/app/page.tsx
export const dynamic = 'force-dynamic'


import { apiClient } from '@/lib/api-client'
import { Product, Category } from '@/types'
import ProductBrowser from '@/components/ProductBrowser'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'



export default async function Home() {
  // STEP 1: Fetch data in parallel to minimize loading time
  // Promise.all runs both API calls simultaneously instead of sequentially
  const [products, categories]: [Product[], Category[]] = await Promise.all([
    apiClient.getProducts(),  // Existing endpoint - returns array of Product
    apiClient.getCategories(), // NEW: Need to add this method to api-client.ts
  ]);

  // STEP 2: Log for debugging (only visible in server console)
  console.log(`Fetched ${products.length} products and ${categories.length} categories`);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">VerdeAfrique</h1>
      <p className="text-gray-600 mb-8">Premium cannabis products</p>
      
      {/* Auth Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <LoginForm />
        <RegisterForm />
      </div>
      
      {/* Product Catalog Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Catalog</h2>
        <ProductBrowser initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}

