import DashboardStats from '../../components/admin/DashboardStats';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Section */}
      <div className="mb-8">
        <DashboardStats />
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black">Quick Actions</h2>
        <div className="space-x-4">
          <Link href="/admin/products" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Manage Products
          </Link>
          <Link href="/admin/users" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Manage Users
          </Link>
        </div>
      </div>
      
      {/* Recent Activity (Placeholder) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-black">Recent Activity</h2>
        <p className="text-gray-500">Activity logs will appear here once implemented.</p>
      </div>
    </div>
  );
}