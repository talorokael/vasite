// apps/frontend/app/admin/page.tsx
import DashboardStats from '../../components/admin/DashboardStats';
import Link from 'next/link';
import { Package, Users, ShoppingCart, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard | VerdeAfrique',
  description: 'Manage your VerdeAfrique store',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your store performance and quick actions
        </p>
      </div>

      {/* Stats Section */}
      <DashboardStats />

      {/* Quick Actions */}
      <section className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Manage Products</p>
              <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Manage Users</p>
              <p className="text-sm text-muted-foreground">View and manage user accounts</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </Link>

          <Link
            href="/admin/customers"
            className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors group"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Customers</p>
              <p className="text-sm text-muted-foreground">View customer addresses and orders</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors group"
          >
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">View Orders</p>
              <p className="text-sm text-muted-foreground">Track and manage orders</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Activity logs will appear here once implemented.
          </p>
        </div>
      </section>
    </div>
  );
}
