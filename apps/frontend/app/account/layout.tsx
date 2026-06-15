'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { User } from 'lucide-react';

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{user?.name || 'Customer'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link href="/account" className="block px-3 py-2 rounded hover:bg-muted">
                  Overview
                </Link>
                <Link href="/account/orders" className="block px-3 py-2 rounded hover:bg-muted">
                  Orders
                </Link>
                <Link href="/account/addresses" className="block px-3 py-2 rounded hover:bg-muted">
                  Addresses
                </Link>
                <Link href="/account/profile" className="block px-3 py-2 rounded hover:bg-muted">
                  Profile
                </Link>
              </nav>
            </div>
          </aside>

          <section className="md:col-span-3">{children}</section>
        </div>
      </div>
    </div>
  );
}
