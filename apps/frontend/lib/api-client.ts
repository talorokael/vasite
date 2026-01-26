// apps/frontend/lib/api-client.ts
import { Product, User, Category } from '../types';

const API_BASE_URL = 'http://localhost:3001';

interface AuthResponse {
  user: User;
  token: string;
}

export class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
  this.token = token;
  // Also sync with localStorage
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
}

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      const existingHeaders = options.headers as Record<string, string>;
      Object.assign(headers, existingHeaders);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/products');
  }
  
  
async getCategories(): Promise<Category[]> {
  return this.request<Category[]>('/api/categories');
}

// Also add register method (for AuthContext):
async register(email: string, password: string, name?: string): Promise<AuthResponse> {
  const data = await this.request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  this.setToken(data.token);
  return data;
}

// And getMe method:
async getMe(): Promise<User> {
  return this.request<User>('/api/auth/me');
}

// Add logout method to clear token:
logout() {
  this.token = null;
  // If using localStorage:
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }
}

 

export const apiClient = new ApiClient();