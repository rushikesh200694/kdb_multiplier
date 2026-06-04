import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { orderAPI } from '../api/index.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getMyOrders();
      setOrders(res.data);
      // Auto expand the first order if exists
      if (res.data.length > 0) {
        setExpandedOrders({ [res.data[0]._id]: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch order history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Status mapping
  const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
  
  const getStatusStepIndex = (status) => {
    return statuses.indexOf(status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'Confirmed': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'Delivered': return <Check className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-gray text-sm font-medium animate-pulse">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card p-8 border border-red-100 bg-red-50/50">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-dark mb-2">Failed to load orders</h2>
          <p className="text-text-gray text-sm mb-6">{error}</p>
          <button onClick={fetchOrders} className="btn-primary justify-center mx-auto">Try Again</button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="card p-8 shadow-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-8 h-8 text-text-gray" />
          </div>
          <h2 className="text-xl font-bold text-text-dark mb-2">No orders yet</h2>
          <p className="text-text-gray text-sm mb-6">Looks like you haven't placed any orders yet. Discover our premium agricultural products and get started!</p>
          <Link to="/products" className="btn-primary justify-center">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <title>My Orders – KBD Multiplier Dhule</title>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-green/10 rounded-2xl flex items-center justify-center text-primary-green">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-dark">Order History</h1>
          <p className="text-text-gray text-sm">Track your shipments and check details of your past orders</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const currentStepIdx = getStatusStepIndex(order.status);
          const isExpanded = expandedOrders[order._id];

          return (
            <div key={order._id} className="card overflow-hidden border border-border/80 hover:shadow-lg transition-all duration-300">
              {/* Header summary of the order */}
              <div 
                onClick={() => toggleExpand(order._id)}
                className="p-5 sm:p-6 bg-white hover:bg-gray-50/50 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  <div>
                    <span className="text-xs font-semibold text-text-gray uppercase tracking-wider block mb-1">Order Placed</span>
                    <span className="text-sm font-medium text-text-dark flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-text-gray" />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-gray uppercase tracking-wider block mb-1">Total Amount</span>
                    <span className="text-sm font-bold text-primary-green">₹{order.totalAmount}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-gray uppercase tracking-wider block mb-1">Order ID</span>
                    <span className="text-sm font-mono text-text-dark">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-gray uppercase tracking-wider block mb-1">Status</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColorClass(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                  <span className="sm:hidden text-xs text-text-gray">View details & tracking</span>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-text-gray transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Details Panel & Stepper */}
              {isExpanded && (
                <div className="border-t border-border bg-gray-50/30 p-5 sm:p-6 space-y-6">
                  {/* Real-time Order Tracking Visual Stepper */}
                  <div className="py-4">
                    <h3 className="text-sm font-bold text-text-dark mb-6 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-green" />
                      Real-time Shipment Tracker
                    </h3>
                    
                    <div className="relative">
                      {/* Desktop Horizontal Line */}
                      <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-gray-200 -z-10 rounded-full">
                        <div 
                          className="h-full bg-primary-green rounded-full transition-all duration-500" 
                          style={{ width: `${(currentStepIdx / (statuses.length - 1)) * 100}%` }}
                        />
                      </div>

                      {/* Stepper container */}
                      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 relative">
                        {statuses.map((step, idx) => {
                          const isCompleted = idx <= currentStepIdx;
                          const isActive = idx === currentStepIdx;

                          return (
                            <div key={step} className="flex md:flex-col items-center md:text-center md:flex-1 relative">
                              {/* Step circle */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 ${
                                isCompleted 
                                  ? 'bg-primary-green border-primary-green text-white shadow-md' 
                                  : 'bg-white border-gray-300 text-gray-400'
                              } ${isActive ? 'ring-4 ring-primary-green/20 scale-110' : ''}`}>
                                {isCompleted ? (
                                  <Check className="w-5 h-5 stroke-[3]" />
                                ) : (
                                  <span className="text-sm font-bold">{idx + 1}</span>
                                )}
                              </div>

                              {/* Vertical Line for Mobile */}
                              {idx < statuses.length - 1 && (
                                <div className={`md:hidden absolute left-5 top-10 bottom-0 w-0.5 -z-10 h-8 ${
                                  idx < currentStepIdx ? 'bg-primary-green' : 'bg-gray-200'
                                }`} />
                              )}

                              {/* Step Labels */}
                              <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center">
                                <p className={`text-sm font-bold ${isCompleted ? 'text-text-dark' : 'text-text-gray/70'}`}>
                                  {step}
                                </p>
                                <p className="text-xs text-text-gray mt-0.5">
                                  {step === 'Pending' && 'Order received'}
                                  {step === 'Confirmed' && 'Being processed'}
                                  {step === 'Shipped' && 'In transit'}
                                  {step === 'Delivered' && 'Order received'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Order items and Delivery Address */}
                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                    {/* Items Purchased */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-text-dark">Items Ordered</h4>
                      <div className="bg-white rounded-xl border border-border p-4 divide-y divide-border">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                            <div>
                              <p className="text-sm font-semibold text-text-dark">{item.name}</p>
                              <p className="text-xs text-text-gray">
                                {item.quantity} × ₹{item.price} / {item.unit}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-text-dark">
                              ₹{(item.price * item.quantity).toFixed(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-text-dark">Shipping & Delivery Details</h4>
                      <div className="bg-white rounded-xl border border-border p-4 space-y-3 text-sm text-text-dark">
                        <div className="flex gap-2">
                          <span className="font-semibold w-24 text-text-gray">Recipient:</span>
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold w-24 text-text-gray">Mobile:</span>
                          <span>{order.customerPhone}</span>
                        </div>
                        <div className="flex gap-2 items-start">
                          <MapPin className="w-4 h-4 text-text-gray mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold block text-text-gray">Delivery Address:</span>
                            <span className="text-text-gray text-xs block mt-0.5 leading-relaxed">
                              {order.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
