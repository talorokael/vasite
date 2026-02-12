// apps/frontend/app/admin/products/page.tsx
import { apiClient } from '@/lib/api-client';
import ProductsTable from './ProductsTable';

export default function AdminProductsPage() {
  return <ProductsTable />;
}