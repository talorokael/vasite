// apps/frontend/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server';
import Link from 'next/link';
import { LayoutDashboard, Package, Users, ShoppingCart, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Admin | VerdeAfrique',
  description: 'Admin dashboard for VerdeAfrique store management',
};

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
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary">VerdeAfrique</h2>
          <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-primary">Admin Panel</h2>
          <nav className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                title={link.label}
              >
                <link.icon className="w-5 h-5" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
