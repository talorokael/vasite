'use client'; // 👈 THIS IS CRITICAL
import { useState } from 'react';
import { Product, Category } from '../types';
import CategoryFilter from '../components/CategoryFilter';

interface ProductBrowserProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductBrowser({ 
  initialProducts, 
  categories 
}: ProductBrowserProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const filteredProducts = selectedCategoryId
    ? initialProducts.filter(product => product.categoryId === selectedCategoryId)
    : initialProducts;

      // Define the handler function
  const handleViewDetails = (productId: string) => {
    console.log('View details for:', productId);
    // Add navigation or modal logic here
  };

  return (
    <div className="space-y-8">
      {/* Category display section */}
      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Display product count */}
      <p className="text-gray-600">
        Showing {filteredProducts.length} of {initialProducts.length} products
      </p>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-green-700">
                ${(product.price / 100).toFixed(2)}
              </span>
              <button 
                onClick={() => handleViewDetails(product.id)}

                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}