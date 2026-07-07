// apps/frontend/lib/api-client.ts
import { Product, User, Category } from "../types";
import { Cart } from './CartContext'; // or define locally
export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images?: string[];
  };
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface AdminOrder extends Order {
  user: {
    email: string;
    name: string | null;
  };
}

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL_SERVER ||
      "https://backend-production-dfc8.up.railway.app"
    : process.env.NEXT_PUBLIC_API_URL || "https://api.verdeafrique.co.za";

export class ApiClient {
  private token: string | null = null; // 👈 add private token storage

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // Get response text once
    const text = await response.text();

    // If response is not OK, throw detailed error
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        // Try to parse error as JSON (backend might send { error: "..." })
        const errorJson = JSON.parse(text);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch {
        // If not JSON, use text (truncated)
        if (text) errorMessage += ` - ${text.substring(0, 100)}`;
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses
    if (!text) {
      return {} as T;
    }

    // Now safe to parse JSON
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }
  }

  public async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    return this.request<T>(endpoint, options);
  }

  async getProducts(params?: { page?: number; limit?: number }): Promise<{
    products: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    return this.request<{
      products: Product[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/api/products?${query.toString()}`);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request(`/api/products/${id}`, {
      method: "DELETE",
    });
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async createProduct(data: Omit<Product, "id">): Promise<Product> {
    return this.request<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>("/api/categories");
  }

  async register(
    email: string,
    password: string,
    name?: string,
  ): Promise<{ user: User; token: string }> {
    const data = await this.request<{ user: User; token: string }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      },
    );
    this.setToken(data.token);
    return data;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const data = await this.request<{ user: User; token: string }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
    this.setToken(data.token);
    return data;
  }

  async logout(): Promise<void> {
    await this.request("/api/auth/logout", {
      method: "POST",
    });
    this.clearToken();
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/api/auth/me");
  }

  async getUsers(params?: { page?: number; limit?: number }): Promise<{
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    return this.request<{
      users: User[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/api/admin/users?${query.toString()}`);
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    return this.request<User>(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  }

  async getStats(): Promise<{
    users: { total: number };
    products: { total: number };
    categories: { total: number };
    updatedAt: string;
  }> {
    return this.request("/api/admin/stats");
  }

  async createCheckoutSession(): Promise<{ sessionId: string; url: string }> {
    return this.request("/api/checkout/create-session", { method: "POST" });
  }

  async mergeGuestCart(
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<Cart> {
    return this.request<Cart>("/api/cart/merge", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  }

  // Orders (user)
  async getOrders(page = 1): Promise<{
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.request(`/api/orders?page=${page}`);
  }

  async getOrder(id: string): Promise<Order> {
    return this.request(`/api/orders/${id}`);
  }

  // Admin orders
  async getAllOrders(page = 1): Promise<{
    orders: AdminOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.request(`/api/admin/orders?page=${page}`);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return this.request(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Admin: get addresses for a specific user
  async getAdminUserAddresses(userId: string): Promise<{ addresses: Array<{
    id: string;
    name?: string | null;
    street: string;
    city: string;
    postalCode?: string | null;
    country?: string | null;
    phone?: string | null;
    isDefault: boolean;
  }> }>
  {
    return this.request(`/api/admin/users/${userId}/addresses`);
  }

  // Admin: get orders for a specific user
  async getAdminUserOrders(userId: string): Promise<{ orders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
  }> }>
  {
    return this.request(`/api/admin/users/${userId}/orders`);
  }
}

export const apiClient = new ApiClient();
