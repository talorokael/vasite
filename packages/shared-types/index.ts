export interface User {
  _count: { addresses: number; orders: number; };
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string | null;
  categoryName?: string | null;  
  sku?: string | null;
  inventory?: number;
  isAvailable?: boolean;
  tags?: string[];
  images?: string[];
  productType: string
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { products: number };
}