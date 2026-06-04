import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Category-specific placeholder images from Unsplash
const CATEGORY_IMAGES = {
  'Fertilizers':       'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80&fit=crop',
  'Multilayers':       'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80&fit=crop',
  'Ayurvedic Medicines':'https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=400&q=80&fit=crop',
  'Soaps':             'https://images.unsplash.com/photo-1552947897-02c5a2cd5c14?w=400&q=80&fit=crop',
  'Organic Products':  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80&fit=crop',
  'Crop Nutrients':    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&q=80&fit=crop',
  'Pest Control':      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80&fit=crop',
  'Soil Improvement':  'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&q=80&fit=crop',
};
const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80&fit=crop';

const CATEGORY_COLORS = {
  'Fertilizers':        'bg-green-100 text-green-700',
  'Multilayers':        'bg-blue-100 text-blue-700',
  'Ayurvedic Medicines':'bg-amber-100 text-amber-700',
  'Soaps':              'bg-purple-100 text-purple-700',
  'Organic Products':   'bg-emerald-100 text-emerald-700',
  'Crop Nutrients':     'bg-teal-100 text-teal-700',
  'Pest Control':       'bg-red-100 text-red-700',
  'Soil Improvement':   'bg-orange-100 text-orange-700',
};

export default function ProductCard({ product }) {
  const { cartItems, addToCart, updateQuantity, wishlist, toggleWishlist } = useCart();
  const isWishlisted = wishlist?.some(w => w._id === product._id);

  const imgSrc = product.images?.[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`)
    : (CATEGORY_IMAGES[product.category] || DEFAULT_PLACEHOLDER);

  const lowestPrice = product.prices?.[0];
  const categoryColor = CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-600';

  const cartItem = lowestPrice
    ? cartItems?.find(item => item._id === product._id && item.selectedUnit === lowestPrice.unit)
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-premium hover:shadow-premium-hover transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '180px' }}>
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={e => {
            e.target.src = DEFAULT_PLACEHOLDER;
          }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/products/${product._id}`}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white text-primary-green text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </Link>
        </div>
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${categoryColor}`}>
            {product.category}
          </span>
        </div>
        {/* Wishlist button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-all hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-text-dark text-sm line-clamp-2 leading-snug mb-1 group-hover:text-primary-green transition-colors">
          {product.name}
        </h3>
        <p className="text-text-gray text-xs line-clamp-2 leading-relaxed mb-2 flex-1">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.round(product.ratings || 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-xs text-text-gray">({product.reviews || 0})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          {lowestPrice ? (
            <div>
              <span className="text-base font-black text-primary-green">₹{lowestPrice.price}</span>
              <span className="text-xs text-text-gray ml-1">/{lowestPrice.quantity}{lowestPrice.unit}</span>
            </div>
          ) : (
            <span className="text-sm text-text-gray">Price on request</span>
          )}
          {cartItem ? (
            <div className="flex items-center bg-primary-green text-white rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-primary-green">
              <button
                onClick={() => updateQuantity(product._id, lowestPrice.unit, cartItem.selectedQuantity - 1)}
                className="px-2.5 py-1 hover:bg-primary-dark transition-colors font-bold text-xs flex items-center justify-center min-w-[28px] h-7"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-1 text-xs font-bold min-w-[20px] text-center select-none">
                {cartItem.selectedQuantity}
              </span>
              <button
                onClick={() => updateQuantity(product._id, lowestPrice.unit, cartItem.selectedQuantity + 1)}
                className="px-2.5 py-1 hover:bg-primary-dark transition-colors font-bold text-xs flex items-center justify-center min-w-[28px] h-7"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => lowestPrice && addToCart(product, 1, lowestPrice.unit, lowestPrice.price)}
              className="flex items-center gap-1 bg-primary-green hover:bg-primary-dark text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex-shrink-0 shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
