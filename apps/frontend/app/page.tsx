// apps/frontend/app/page.tsx
export const dynamic = "force-dynamic";
import { Product, Category } from "shared-types";
import { apiClient } from "@/lib/api-client";
import HomePageClient from "../components/HomePageClient";

console.log("🔍 API URL (server):", process.env.NEXT_PUBLIC_API_URL);

export default async function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-dfc8.up.railway.app";

  // Default empty states
  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    const healthRes = await fetch(`${API_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log("Health check from server:", healthData);
  } catch (err) {
    console.error("Health check failed:", err);
  }

  // Gracefully handle API failures
  try {
    const productsResponse = await apiClient.getProducts({
      page: 1,
      limit: 50,
    });
    products = productsResponse.products;
  } catch (error) {
    console.error("⚠️ Homepage: Failed to load products");
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error),
    );
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
  }

  try {
    categories = await apiClient.getCategories();
  } catch (error) {
    console.error("⚠️ Homepage: Failed to load categories");
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error),
    );
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
  }

  console.log(
    `🏠 Homepage: ${products.length} products, ${categories.length} categories`,
  );

  return <HomePageClient products={products} categories={categories} />;
}
