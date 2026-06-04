import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ZoomIn, ChevronLeft, Package, ArrowLeft } from 'lucide-react';
import { productAPI, reviewAPI } from '../api/index.js';
import { useCart } from '../context/CartContext';
import Stars from '../components/Stars';
import ProductCard from '../components/ProductCard';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pRes, allRes, rRes] = await Promise.allSettled([
          productAPI.getById(id),
          productAPI.getAll(),
          reviewAPI.getAll()
        ]);
        if (pRes.status === 'fulfilled') {
          const p = pRes.value.data;
          setProduct(p);
          setSelectedPrice(p.prices?.[0]);
        }
        if (allRes.status === 'fulfilled' && pRes.status === 'fulfilled') {
          const allProds = allRes.value.data;
          const p = pRes.value.data;
          setRelated(allProds.filter(x => x._id !== p._id && x.category === p.category).slice(0, 4));
        }
        if (rRes.status === 'fulfilled') {
          const productReviews = rRes.value.data.filter(r => r.productId === id);
          setReviews(productReviews);
        }
      } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedPrice) return;
    addToCart(product, qty, selectedPrice.unit, selectedPrice.price);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const totalPrice = selectedPrice ? (selectedPrice.price * qty).toFixed(0) : '0';

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-text-gray">Product not found.</p>
      <Link to="/products" className="btn-primary mt-4">Back to Products</Link>
    </div>
  );

  const images = product.images?.length > 0
    ? product.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`)
    : [PLACEHOLDER];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <title>{product.name} – KBD Multiplier Dhule</title>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <Link to="/" className="hover:text-primary-green">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-green">Products</Link>
        <span>/</span>
        <span className="text-text-dark font-medium line-clamp-1">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <div>
          <div
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 mb-3 cursor-zoom-in"
            style={{ height: '380px' }}
            onClick={() => setZoom(true)}
          >
            <img
              src={images[activeImg]}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />
            <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-lg text-text-gray hover:text-primary-green">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-primary-green' : 'border-border'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="badge bg-primary-green/10 text-primary-green mb-3">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-text-dark mb-2">{product.name}</h1>

          {product.ratings > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <Stars rating={product.ratings} />
              <span className="text-text-gray text-sm">({product.reviews} reviews)</span>
            </div>
          )}

          <p className="text-text-gray mb-5 leading-relaxed">{product.shortDescription}</p>

          {/* Price Selector */}
          {product.prices?.length > 0 && (
            <div className="mb-5">
              <p className="font-semibold text-text-dark text-sm mb-2">Select Quantity & Unit:</p>
              <div className="flex flex-wrap gap-2">
                {product.prices.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPrice(p)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedPrice === p
                        ? 'border-primary-green bg-primary-green/10 text-primary-green'
                        : 'border-border text-text-gray hover:border-primary-green'
                    }`}
                  >
                    {p.quantity} {p.unit} — ₹{p.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Price */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 border border-border rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 text-text-dark font-bold">-</button>
              <span className="px-4 py-2 font-semibold text-text-dark min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 hover:bg-gray-100 text-text-dark font-bold">+</button>
            </div>
            {selectedPrice && (
              <div>
                <p className="text-2xl font-bold text-primary-green">₹{totalPrice}</p>
                <p className="text-text-gray text-xs">for {qty} × {selectedPrice.quantity}{selectedPrice.unit}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-primary-green text-white hover:bg-primary-dark'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                isWishlisted(product._id)
                  ? 'border-red-400 bg-red-50 text-red-400'
                  : 'border-border text-text-gray hover:border-red-300'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted(product._id) ? 'fill-red-400' : ''}`} />
            </button>
          </div>
          <Link to="/cart" className="w-full btn-accent justify-center text-sm">
            <Package className="w-4 h-4" /> Buy Now
          </Link>
        </div>
      </div>

      {/* Description Tabs */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-text-dark mb-4">Product Details</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-text-gray leading-relaxed mb-4">{product.longDescription}</p>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-semibold text-text-dark mb-2">Benefits</h3>
              <ul className="space-y-1 text-sm text-text-gray">
                <li>✅ Improves soil health and fertility</li>
                <li>✅ Safe for all crops and livestock</li>
                <li>✅ Eco-friendly, chemical-free formula</li>
                <li>✅ Increases yield by up to 40%</li>
                <li>✅ Easy application</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-text-dark mb-2">How to Use</h3>
              <ul className="space-y-1 text-sm text-text-gray">
                <li>📌 Apply before or during planting season</li>
                <li>📌 Mix with water for liquid application</li>
                <li>📌 Store in cool and dry place</li>
                <li>📌 Keep away from direct sunlight</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-text-dark mb-4">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map(r => (
              <div key={r._id} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green font-bold">
                    {r.visitorName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-text-dark text-sm">{r.visitorName}</p>
                    <Stars rating={r.rating} size={3} />
                  </div>
                </div>
                <p className="text-text-gray text-sm">{r.reviewText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-text-dark mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {zoom && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <img src={images[activeImg]} alt={product.name} className="max-w-full max-h-full object-contain rounded-xl" />
          <button className="absolute top-4 right-4 text-white bg-white/20 p-2 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
