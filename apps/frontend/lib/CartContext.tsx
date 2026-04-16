// apps/frontend/lib/CartContext.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import useSWR, { mutate } from "swr";
import { apiClient } from "./api-client";
import { useAuth } from "./AuthContext";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const fetcher = async () => {
  return await apiClient.fetch<Cart>("/api/cart", { method: "GET" });
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const { data: cart, isLoading } = useSWR<Cart>(
    user ? "/api/cart" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const addToCart = async (productId: string, quantity: number) => {
    if (!user) {
      alert("Please log in to add items to cart");
      return;
    }
    await apiClient.fetch("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    mutate("/api/cart");
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await apiClient.fetch(`/api/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    mutate("/api/cart");
  };

  const removeItem = async (itemId: string) => {
    await apiClient.fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    mutate("/api/cart");
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart: cart || null,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}