// apps/frontend/types/index.ts

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string | null;  
  // Add other fields as you use them
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  _count: {
    products: number;
  };
}