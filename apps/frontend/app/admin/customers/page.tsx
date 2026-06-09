'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  _count: { addresses?: number; orders?: number };
  phone?: string | null;
};

export default function AdminCustomersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await apiClient.getUsers({ page: 1, limit: 50 });
        const rows: UserRow[] = res.users.map(u => ({ ...u, phone: null }));

        // Fetch default phone for each user (best-effort)
        await Promise.all(rows.map(async (r) => {
          try {
            const addrRes = await apiClient.getAdminUserAddresses(r.id);
            const defaultAddr = addrRes.addresses?.find(a => a.isDefault) || addrRes.addresses?.[0];
            if (defaultAddr) r.phone = defaultAddr.phone || null;
          } catch (err) {
            // ignore per-user fetch failure
          }
        }));

        setUsers(rows);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => (
      u.email.toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q)
    ));
  }, [users, query]);

  if (!user || user.role !== 'ADMIN') {
    return <div className="p-6">Unauthorized</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage and view customer contact details and history.</p>
      </div>

      <div className="flex items-center justify-between">
        <input
          placeholder="Search by email or name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-border rounded px-3 py-2 w-72"
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-muted-foreground">
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Addresses</th>
                  <th className="px-3 py-2">Orders</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="px-3 py-3"><div className="text-sm font-medium">{u.email}</div></td>
                    <td className="px-3 py-3">{u.name || '-'}</td>
                    <td className="px-3 py-3">{u.phone || '-'}</td>
                    <td className="px-3 py-3">{u._count?.addresses ?? 0}</td>
                    <td className="px-3 py-3">{u._count?.orders ?? 0}</td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/customers/${u.id}`} className="text-primary hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
