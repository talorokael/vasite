"use client";
import Image from "next/image";
import useSWR from "swr";
import { useState } from "react";
import { Product, Category } from "../types";
import CategoryFilter from "./CategoryFilter";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

interface ProductBrowserProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductBrowser({
  initialProducts,
  categories,
}: ProductBrowserProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const {
    data: products = initialProducts,
    error,
    isLoading,
  } = useSWR<Product[]>(
    "/api/products",
    async () => {
      const result = await apiClient.getProducts({ page: 1, limit: 100 });
      return result.products;
    },
    { fallbackData: initialProducts },
  );

  const handleViewDetails = (id: string) => {
    router.push(`/products/${id}`);
  };

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
  };

  if (error) return <div>Failed to load products</div>;
  if (isLoading) return <div>Loading products...</div>;

  const filteredProducts = selectedCategoryId
    ? products.filter((product) => product.categoryId === selectedCategoryId)
    : products;

  return (
    <div className="space-y-8">
      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <p className="text-white-600">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {product.images && product.images[0] && (
              <div className="relative w-full h-48 mb-3">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <h3 className="font-medium text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center gap-2">
              <span className="font-bold text-green-700">
                ${(product.price / 100).toFixed(2)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleViewDetails(product.id)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}