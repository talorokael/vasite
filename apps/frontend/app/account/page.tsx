// apps/frontend/app/account/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // If user is logged in – show account info & logout button
  if (user) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">My Account</h1>
          <p className="text-gray-600 mb-2">Logged in as:</p>
          <p className="font-medium text-gray-800 mb-4">{user.email}</p>
          {user.name && <p className="text-sm text-gray-500 mb-6">{user.name}</p>}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
          <Link href="/account/orders" className="mt-4 inline-block text-green-600 hover:underline">
            View my orders
          </Link>
        </div>
      </div>
    );
  }

  // Not logged in – show two buttons: Login and Register
  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Account</h1>
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}