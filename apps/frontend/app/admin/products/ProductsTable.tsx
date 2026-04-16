"use client";
import Image from 'next/image';

import { Product } from "@/types";
import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/AuthContext";

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ProductsTable() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showDeleted, setShowDeleted] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    user ? `/api/products?page=${currentPage}&limit=${itemsPerPage}` : null,
    async () => {
      return await apiClient.getProducts({
        page: currentPage,
        limit: itemsPerPage,
      });
    },
    { keepPreviousData: true },
  );

  const products: Product[] = showDeleted
    ? data?.products || []
    : data?.products?.filter((p) => p.isAvailable) || [];

  const totalPages = data?.pagination?.totalPages || 1;
  const totalItems = data?.pagination?.total || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiClient.deleteProduct(productId);
      mutate(); // revalidate
    } catch (error: unknown) {
      console.error("Failed to delete product:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to delete product: ${message}`);
    }
  };

  if (isLoading) return <div className="p-8">Loading products...</div>;
  if (error)
    return <div className="p-8 text-red-600">Failed to load products</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Link
          href="/admin/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add New Product
        </Link>
      </div>

      {/* Pagination Controls with Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <span className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            products
          </span>

          {/* Toggle Checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Show deleted products</span>
          </label>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-3">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  {product.images && product.images[0] ? (
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded"></div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                  {product.sku && (
                    <div className="text-sm text-gray-500">
                      SKU: {product.sku}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  ${(product.price / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {product.categoryName || "Uncategorized"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      product.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isAvailable ? "Available" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found. Add your first product!
          </div>
        )}
      </div>
    </div>
  );
}
