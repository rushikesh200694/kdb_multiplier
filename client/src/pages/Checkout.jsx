import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Phone, MapPin, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { orderAPI } from '../api/index.js';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, login: customerLogin, register: customerRegister, logout } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Customer Login/Register UI State
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, name: user.name }));
    } else {
      setForm(prev => ({ ...prev, name: '' }));
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (isLoginTab) {
        if (!authForm.email || !authForm.password) {
          setAuthError('Please fill in all fields.');
          setAuthLoading(false);
          return;
        }
        await customerLogin(authForm.email, authForm.password);
      } else {
        if (!authForm.name || !authForm.email || !authForm.password) {
          setAuthError('Please fill in all fields.');
          setAuthLoading(false);
          return;
        }
        await customerRegister(authForm.name, authForm.email, authForm.password);
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setError('Please fill all required fields.'); return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.'); return;
    }
    setLoading(true); setError('');
    try {
      const orderData = {
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: user?.email,
        address: form.address,
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.selectedQuantity,
          unit: item.selectedUnit,
          price: item.selectedPrice
        })),
        totalAmount: cartTotal
      };
      await orderAPI.create(orderData);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="card p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-primary-green" />
        </div>
        <h2 className="text-2xl font-bold text-text-dark mb-2">Order Placed! 🎉</h2>
        <p className="text-text-gray mb-1">Thank you, <strong>{form.name}</strong>!</p>
        <p className="text-text-gray text-sm mb-6">We'll contact you at <strong>{form.phone}</strong> to confirm your order.</p>
        <Link to="/products" className="btn-primary justify-center">Continue Shopping</Link>
      </div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-text-gray mb-4">Your cart is empty.</p>
      <Link to="/products" className="btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <title>Checkout – KBD Multiplier Dhule</title>
      <h1 className="text-2xl font-bold text-text-dark mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form / Auth */}
        {!user ? (
          <div className="card p-6 border-2 border-primary-green/20">
            <div className="flex border-b border-border mb-6">
              <button
                type="button"
                onClick={() => { setIsLoginTab(true); setAuthError(''); }}
                className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
                  isLoginTab ? 'border-primary-green text-primary-green' : 'border-transparent text-text-gray hover:text-text-dark'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsLoginTab(false); setAuthError(''); }}
                className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
                  !isLoginTab ? 'border-primary-green text-primary-green' : 'border-transparent text-text-gray hover:text-text-dark'
                }`}
              >
                Create Account
              </button>
            </div>

            <h3 className="font-bold text-text-dark text-lg mb-2">
              {isLoginTab ? 'Welcome Back!' : 'Join KBD Multiplier'}
            </h3>
            <p className="text-text-gray text-xs mb-5">
              {isLoginTab
                ? 'Sign in to your account to place this order and manage your farm products.'
                : 'Create a free account to track your orders, leave product reviews, and more.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLoginTab && (
                <div>
                  <label className="text-xs font-semibold text-text-dark mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="input-field py-2 text-sm"
                    required
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-text-dark mb-1 block">Email Address *</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="input-field py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-dark mb-1 block">Password *</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field py-2 text-sm"
                  required
                />
              </div>

              {authError && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100">
                  ⚠️ {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full btn-primary justify-center py-2.5 mt-2 shadow-md hover:shadow-lg text-sm"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <span>{isLoginTab ? 'Sign In & Continue' : 'Create Account & Continue'}</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="card p-6 relative">
            <div className="absolute top-4 right-6 text-xs text-text-gray flex items-center gap-2">
              <span>Logged in as <strong>{user.name}</strong></span>
              <button onClick={logout} className="text-red-500 hover:underline">Sign Out</button>
            </div>
            <h2 className="font-semibold text-text-dark mb-4 mt-2">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5" /> Full Name *
                </label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Mobile Number *
                </label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" type="tel" className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Delivery Address *
                </label>
                <textarea name="address" value={form.address} onChange={handleChange} placeholder="Village, Taluka, District, PIN Code" rows={3} className="input-field resize-none" required />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1">Order Notes (Optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any special instructions..." rows={2} className="input-field resize-none" />
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

              <div className="pt-2">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-sm text-blue-700">
                  💳 <strong>Cash on Delivery</strong> — Pay when you receive your order.
                </div>
                <button type="submit" disabled={loading} className="w-full btn-accent justify-center py-3">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Placing Order...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4" /> Place Order
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Order Summary */}
        <div>
          <div className="card p-5">
            <h2 className="font-semibold text-text-dark mb-4">Your Order</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={`${item._id}-${item.selectedUnit}`} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-text-dark line-clamp-1">{item.name}</p>
                    <p className="text-text-gray text-xs">{item.selectedQuantity} × ₹{item.selectedPrice} / {item.selectedUnit}</p>
                  </div>
                  <p className="font-semibold text-text-dark">₹{(item.selectedPrice * item.selectedQuantity).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-gray">Subtotal</span>
                <span className="font-medium">₹{cartTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-text-gray">Shipping</span>
                <span className="text-primary-green font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-text-dark text-lg">
                <span>Total</span>
                <span className="text-primary-green">₹{cartTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
