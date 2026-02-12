// apps/frontend/app/page.tsx
export const dynamic = "force-dynamic";
import { Product, Category } from "shared-types";
import { apiClient } from "@/lib/api-client";
import HomePageClient from "../components/HomePageClient";

export default async function Home() {
  // Default empty states
  let products: Product[] = [];
  let categories: Category[] = [];

  // Gracefully handle API failures
  try {
    const productsResponse = await apiClient.getProducts({
      page: 1,
      limit: 50,
    });
    products = productsResponse.products;
  } catch (error) {
    console.error("⚠️ Homepage: Failed to load products", error);
    // Continue with empty array – UI will show "No products"
  }

  try {
    categories = await apiClient.getCategories();
  } catch (error) {
    console.error("⚠️ Homepage: Failed to load categories", error);
    // Continue with empty array
  }

  console.log(
    `🏠 Homepage: ${products.length} products, ${categories.length} categories`,
  );

  return <HomePageClient products={products} categories={categories} />;
}
