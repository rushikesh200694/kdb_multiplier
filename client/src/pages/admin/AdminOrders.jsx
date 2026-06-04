import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { orderAPI } from '../../api/index.js';
import AdminLayout from './AdminLayout';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
const STATUS_COLORS = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    orderAPI.getAll()
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await orderAPI.updateStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch { alert('Error updating status'); }
    finally { setUpdating(null); }
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <AdminLayout>
      <title>Orders – KBD Admin</title>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-dark">Orders</h1>
          <p className="text-text-gray text-sm">{orders.length} total orders</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === s ? 'bg-primary-green text-white' : 'bg-white border border-border text-text-gray hover:border-primary-green'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse shadow-premium h-20"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-premium">
          <ShoppingBag className="w-10 h-10 text-text-gray mx-auto mb-3" />
          <p className="text-text-gray">No {filter === 'All' ? '' : filter} orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-premium overflow-hidden">
              <div className="p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-dark text-sm">{order.customerName}</p>
                    <p className="text-text-gray text-xs">{order.customerPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-right">
                    <p className="font-bold text-primary-green">₹{order.totalAmount}</p>
                    <p className="text-text-gray text-xs">{order.items?.length || 0} item(s)</p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className={`text-xs font-medium px-3 py-1.5 rounded-xl border cursor-pointer appearance-none pr-7 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                    className="text-xs text-text-gray hover:text-primary-green transition-colors underline"
                  >
                    {expandedId === order._id ? 'Hide' : 'Details'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === order._id && (
                <div className="border-t border-border p-4 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-text-gray mb-1">Delivery Address</p>
                      <p className="text-sm text-text-dark">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-gray mb-1">Order Items</p>
                      <div className="space-y-1">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-text-gray">{item.name} × {item.quantity} {item.unit}</span>
                            <span className="font-medium text-text-dark">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
