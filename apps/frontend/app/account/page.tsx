// apps/frontend/app/account/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, Package, User, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AccountPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Logged in state
  if (user) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-lg">
        <div className="bg-card rounded-lg shadow-sm border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
            </div>

            {user.name && (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{user.name}</p>
                </div>
              </div>
            )}

            {user.role === 'ADMIN' && (
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm font-medium text-secondary-foreground">
                  Admin Account
                </p>
                <Link
                  href="/admin"
                  className="text-primary hover:underline text-sm mt-1 inline-block"
                >
                  Go to Admin Dashboard →
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link
              href="/account/orders"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Package className="w-5 h-5" />
              View My Orders
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground py-3 px-4 rounded-md font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Not logged in state
  return (
    <main className="container mx-auto px-4 py-12 max-w-lg">
      <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome</h1>
        <p className="text-muted-foreground mb-8">
          Sign in to access your account, view orders, and manage your preferences.
        </p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="block w-full bg-muted text-foreground py-3 px-4 rounded-md font-medium hover:bg-muted/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
