'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Category } from 'shared-types';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '0',
    productType: 'FLOWER',
    categoryId: '',
    sku: '',
    inventory: '0',
    isAvailable: 'true',
    tags: '',
    images: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: Math.round(parseFloat(formData.price) * 100), // Convert dollars to cents
        productType: formData.productType,
        categoryId: formData.categoryId || null,
        sku: formData.sku || null,
        inventory: parseInt(formData.inventory, 10),
        isAvailable: formData.isAvailable === 'true',
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        images: formData.images ? formData.images.split(',').map(i => i.trim()) : [],
      };

      await apiClient.createProduct(productData);
      router.push('/admin/products');
    } catch (error: unknown) {
  console.error('Failed to create product:', error);
  const message = error instanceof Error ? error.message : 'Unknown error';
  alert(`Failed to create product: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
        <p className="text-gray-600">Create a new product for your store</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Optional"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Inventory */}
          <div>
            <label className="block text-sm font-medium mb-1">Inventory *</label>
            <input
              type="number"
              min="0"
              name="inventory"
              value={formData.inventory}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Uncategorized</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Type *</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="FLOWER">Flower</option>
              <option value="CONCENTRATE">Concentrate</option>
              <option value="EDIBLE">Edible</option>
              <option value="TOPICAL">Topical</option>
              <option value="TINCTURE">Tincture</option>
              <option value="CAPSULE">Capsule</option>
              <option value="ACCESSORY">Accessory</option>
              <option value="MERCHANDISE">Merchandise</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <select
              name="isAvailable"
              value={formData.isAvailable}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="true">Available</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded px-3 py-2"
            placeholder="Product description..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Comma-separated tags: premium, cbd, organic"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Image URLs</label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Comma-separated image URLs"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}