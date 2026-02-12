// apps/frontend/app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { User } from '../../../types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    try {
      await apiClient.updateUserRole(id, role);
      loadUsers(); // Refresh
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 bg-gray-900">User Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black rounded-lg shadow">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Joined</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.name || '-'}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.role === 'ADMIN' 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'Unknown'}
                </td>
                <td className="px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}