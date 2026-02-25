// apps/frontend/lib/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiClient } from './api-client';
import { getCookie } from './cookie'; // 👈 import getCookie

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Rehydrate token from cookie
      const token = getCookie('client_token');
      if (token) {
        apiClient.setToken(token);
      }

      try {
        const response = await apiClient.getMe();
        setUser(response.user);
      } catch (error: unknown) {
        if (error instanceof Error && !error.message.includes('401')) {
          console.error('Auth initialization failed:', error);
        }
        // If 401, token is invalid/expired – clear it from apiClient and cookie?
        // Optionally clear cookie here
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.login(email, password);
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.register(email, password, name);
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } finally {
      setUser(null);
      // Optionally clear the cookie as well
      document.cookie = 'client_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}