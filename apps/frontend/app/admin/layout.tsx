// apps/frontend/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Redirect if not logged in or not admin
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const navLinks = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/users', label: 'Users' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800">VerdeAfrique</h2>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}