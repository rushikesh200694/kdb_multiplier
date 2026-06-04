import { useState, useEffect } from 'react';
import { Package, MapPin, Star, ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import { productAPI, visitAPI, reviewAPI, orderAPI } from '../../api/index.js';
import AdminLayout from './AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, visits: 0, reviews: 0, orders: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pRes, vRes, rRes, oRes] = await Promise.allSettled([
          productAPI.getAll(), visitAPI.getAll(), reviewAPI.getAll(true), orderAPI.getAll()
        ]);
        const products = pRes.status === 'fulfilled' ? pRes.value.data.length : 0;
        const visits = vRes.status === 'fulfilled' ? vRes.value.data.length : 0;
        const reviews = rRes.status === 'fulfilled' ? rRes.value.data.length : 0;
        const orders = oRes.status === 'fulfilled' ? oRes.value.data : [];
        const pending = orders.filter(o => o.status === 'Pending').length;
        setStats({ products, visits, reviews, orders: orders.length, pending });
        setRecentOrders(orders.slice(0, 5));
      } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-primary-green bg-primary-green/10' },
    { label: 'Farm Visits', value: stats.visits, icon: MapPin, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Reviews', value: stats.reviews, icon: Star, color: 'text-accent-yellow bg-amber-50' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-purple-600 bg-purple-50' },
  ];

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-indigo-100 text-indigo-700',
    Delivered: 'bg-green-100 text-green-700',
  };

  return (
    <AdminLayout>
      <title>Dashboard – KBD Admin</title>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-dark">Dashboard</h1>
        <p className="text-text-gray text-sm">Overview of your KBD Multiplier store</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-premium">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-dark">{loading ? '—' : value}</p>
            <p className="text-text-gray text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Pending Orders Alert */}
      {stats.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">{stats.pending} Pending Order{stats.pending !== 1 ? 's' : ''}</p>
            <p className="text-amber-600 text-xs">Requires your attention</p>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-premium overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-text-dark">Recent Orders</h2>
          <span className="text-text-gray text-xs">{recentOrders.length} of {stats.orders}</span>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-10 text-center text-text-gray text-sm">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-text-gray font-medium text-xs">Customer</th>
                  <th className="px-5 py-3 text-left text-text-gray font-medium text-xs">Phone</th>
                  <th className="px-5 py-3 text-left text-text-gray font-medium text-xs">Amount</th>
                  <th className="px-5 py-3 text-left text-text-gray font-medium text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-text-dark">{order.customerName}</td>
                    <td className="px-5 py-3 text-text-gray">{order.customerPhone}</td>
                    <td className="px-5 py-3 font-semibold text-primary-green">₹{order.totalAmount}</td>
                    <td className="px-5 py-3">
                      <span className={`badge text-xs ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
