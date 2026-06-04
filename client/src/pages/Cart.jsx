import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <title>Cart – KBD Multiplier Dhule</title>
      <div className="text-7xl mb-6">🛒</div>
      <h2 className="text-2xl font-bold text-text-dark mb-2">Your cart is empty</h2>
      <p className="text-text-gray mb-8">Add some amazing agricultural products to get started.</p>
      <Link to="/products" className="btn-primary">
        <ShoppingBag className="w-4 h-4" /> Shop Now
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <title>Cart – KBD Multiplier Dhule</title>
      <h1 className="text-2xl font-bold text-text-dark mb-6">Shopping Cart <span className="text-text-gray font-normal text-lg">({cartItems.length} items)</span></h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div key={`${item._id}-${item.selectedUnit}`} className="card p-4 flex gap-4">
              <img
                src={item.images?.[0] ? (item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`) : PLACEHOLDER}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover bg-green-50 flex-shrink-0"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-dark text-sm mb-0.5 line-clamp-1">{item.name}</h3>
                <p className="text-text-gray text-xs mb-2">{item.selectedQuantity_per_unit || ''} {item.selectedUnit}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1 border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedUnit, item.selectedQuantity - 1)}
                      className="px-2 py-1.5 hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold min-w-[32px] text-center">{item.selectedQuantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedUnit, item.selectedQuantity + 1)}
                      className="px-2 py-1.5 hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary-green">
                      ₹{(item.selectedPrice * item.selectedQuantity).toFixed(0)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id, item.selectedUnit)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="font-bold text-text-dark text-base mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cartItems.map(item => (
                <div key={`${item._id}-${item.selectedUnit}`} className="flex justify-between text-sm">
                  <span className="text-text-gray line-clamp-1 flex-1 mr-2">{item.name} × {item.selectedQuantity}</span>
                  <span className="font-medium text-text-dark">₹{(item.selectedPrice * item.selectedQuantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 mb-4">
              <div className="flex justify-between font-bold text-text-dark">
                <span>Total</span>
                <span className="text-primary-green text-lg">₹{cartTotal.toFixed(0)}</span>
              </div>
              <p className="text-text-gray text-xs mt-1">+ Delivery charges as applicable</p>
            </div>
            <Link to="/checkout" className="btn-accent w-full justify-center">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products" className="mt-3 btn-outline w-full justify-center text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
