// apps/frontend/components/admin/DashboardStats.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/lib/api-client';

interface Stats {
  users: { total: number };
  products: { total: number };
  categories: { total: number };
  updatedAt: string;
}

export default function DashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Wait for authentication

    const loadStats = async () => {
      try {
        const data = await apiClient.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [user]);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  if (!stats) {
    return <div>Failed to load stats</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Total Users</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.users.total}</p>
        <p className="text-sm text-gray-500 mt-2">Registered users</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Total Products</h3>
        <p className="text-3xl font-bold text-green-600">{stats.products.total}</p>
        <p className="text-sm text-gray-500 mt-2">Active products</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Total Categories</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.categories.total}</p>
        <p className="text-sm text-gray-500 mt-2">Product categories</p>
      </div>
      
      <div className="md:col-span-3 text-sm text-gray-500">
        Last updated: {new Date(stats.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}