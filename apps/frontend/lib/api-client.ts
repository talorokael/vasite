// apps/frontend/lib/api-client.ts
import { Product, User, Category } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
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
    const data = await this.request<{ user: User; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    return data;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const data = await this.request<{ user: User; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data;
  }

  async logout(): Promise<void> {
    await this.request("/api/auth/logout", {
      method: "POST",
    });
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
    }>(`/api/users?${query.toString()}`);
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {
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
}

export const apiClient = new ApiClient();