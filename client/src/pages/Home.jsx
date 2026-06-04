import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Leaf, Shield, TrendingUp, Award, Star } from 'lucide-react';
import { productAPI, visitAPI, reviewAPI, bannerAPI } from '../api/index.js';
import ProductCard from '../components/ProductCard';
import Stars from '../components/Stars';



const FEATURES = [
  { icon: Leaf, label: '100% Organic', desc: 'All products are certified organic and natural' },
  { icon: Shield, label: 'Safe & Tested', desc: 'Quality tested in certified laboratories' },
  { icon: TrendingUp, label: 'Higher Yield', desc: 'Proven to increase yield by up to 40%' },
  { icon: Award, label: 'Award Winning', desc: 'Recognized by Maharashtra Agriculture Dept.' },
];

const VISIT_PLACEHOLDER = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80';
const REVIEW_PLACEHOLDER = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80';

const FALLBACK_BANNER = {
  title: 'KBD Multiplier Dhule',
  description: 'Discover organic fertilizers, Ayurvedic medicines, and crop nutrients to improve your yield and soil health.',
  image: '',
  productId: null,
};

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [visits, setVisits] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerAPI.getActive();
        setBanners(res.data);
      } catch (err) {
        console.error('Failed to load banners', err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) {
      return undefined;
    }

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length);
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, [banners.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, vRes, rRes] = await Promise.allSettled([
          productAPI.getAll(), visitAPI.getAll(), reviewAPI.getAll()
        ]);
        if (pRes.status === 'fulfilled') setProducts(pRes.value.data.slice(0, 8));
        if (vRes.status === 'fulfilled') setVisits(vRes.value.data.slice(0, 8));
        if (rRes.status === 'fulfilled') setReviews(rRes.value.data.slice(0, 8));
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const goTo = (idx) => {
    clearInterval(intervalRef.current);
    setCurrent(idx);
    intervalRef.current = setInterval(() => setCurrent(c => (c + 1) % (banners.length || 1)), 2500);
  };
  const prev = () => goTo((current - 1 + (banners.length || 1)) % (banners.length || 1));
  const next = () => goTo((current + 1) % (banners.length || 1));

  const currentIndex = banners.length > 0 ? current % banners.length : 0;
  const slide = banners.length > 0 ? banners[currentIndex] : FALLBACK_BANNER;

  return (
    <div className="scroll-smooth">
      {/* SEO */}
      <title>KBD Multiplier Dhule – Premium Agricultural Products</title>
      <meta name="description" content="KBD Multiplier Dhule offers organic fertilizers, Ayurvedic medicines, crop nutrients, and agricultural solutions for farmers in Maharashtra." />

      {/* ===== HERO SLIDER ===== */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
        {/* Background Images */}
        {banners.length > 0 ? banners.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === currentIndex ? 1 : 0 }}
          >
            <img
              src={s.image}
              alt={s.title || 'Hero banner'}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10" />
          </div>
        )) : (
          <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-emerald-700" />
        )}

        {/* Decorative Elements */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg">
              {slide.title}
            </h1>

            <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-xl drop-shadow">
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={slide.productId ? `/products/${slide.productId}` : '/products'}
                className="bg-white text-primary-green font-bold px-7 py-3.5 rounded-xl hover:bg-gray-50 transition-all shadow-xl flex items-center gap-2 text-sm hover:scale-105 active:scale-95"
              >
                {slide.cta || 'Explore Products'} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="border-2 border-white/60 text-white px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all text-sm backdrop-blur-sm"
              >
                All Products
              </Link>
            </div>
          </div>
        </div>

        {/* Arrow Controls */}
        <button
          onClick={prev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-white w-7 h-2.5' : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}

        {/* Slide number */}
        <div className="absolute top-5 right-5 z-20 bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
          {currentIndex + 1} / {banners.length || 1}
        </div>
      </section>

      {/* ===== FEATURES STRIP ===== */}
      <section className="py-8 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-50 transition-colors group">
                <div className="w-11 h-11 bg-primary-green/10 group-hover:bg-primary-green/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-5 h-5 text-primary-green" />
                </div>
                <div>
                  <p className="font-bold text-text-dark text-sm">{label}</p>
                  <p className="text-text-gray text-xs leading-snug hidden md:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className="py-16 bg-background" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-green/10 text-primary-green mb-3">Our Range</span>
            <h2 className="text-3xl font-bold text-text-dark mb-2">Premium Agricultural Products</h2>
            <p className="text-text-gray text-base">Trusted by thousands of farmers across Maharashtra</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-premium animate-pulse">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-text-gray">No products found. Admin can add products from the dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/products" className="border-2 border-primary-green text-primary-green px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-green hover:text-white transition-all duration-200 inline-flex items-center gap-2">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-12 bg-gradient-to-r from-primary-dark to-primary-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '5000+', label: 'Happy Farmers' },
              { value: '50+', label: 'Product Varieties' },
              { value: '15+', label: 'Years Experience' },
              { value: '99%', label: 'Satisfaction Rate' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-black text-white mb-1">{value}</p>
                <p className="text-white/80 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISITS ===== */}
      <section className="py-16 bg-white" id="visits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 mb-3">Farm & Factory</span>
            <h2 className="text-3xl font-bold text-text-dark mb-2">Our Visits</h2>
            <p className="text-text-gray text-base">Explore our farms, manufacturing units and agricultural activities</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-premium animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-2xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : visits.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌾</div>
              <p className="text-text-gray">No visits added yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {visits.map(visit => (
                <Link key={visit._id} to={`/visits/${visit._id}`} className="bg-white rounded-2xl shadow-premium hover:shadow-premium-hover transition-all duration-300 group overflow-hidden block">
                  <div className="relative overflow-hidden" style={{ height: '180px' }}>
                    <img
                      src={visit.gallery?.[0] ? (visit.gallery[0].startsWith('http') ? visit.gallery[0] : `http://localhost:5000${visit.gallery[0]}`) : VISIT_PLACEHOLDER}
                      alt={visit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => { e.target.src = VISIT_PLACEHOLDER; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-white">
                      <p className="text-xs font-medium">{visit.date}</p>
                    </div>
                    {visit.gallery?.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-lg">
                        +{visit.gallery.length - 1}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-text-dark text-sm line-clamp-1 group-hover:text-primary-green transition-colors">{visit.title}</h3>
                    <p className="text-text-gray text-xs line-clamp-2 mt-1">{visit.description}</p>
                    <span className="text-primary-green text-xs font-medium mt-2 inline-flex items-center gap-1">
                      View Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/visits" className="border-2 border-primary-green text-primary-green px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-green hover:text-white transition-all duration-200 inline-flex items-center gap-2">
              View All Visits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50" id="reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-amber-700 mb-3">Testimonials</span>
            <h2 className="text-3xl font-bold text-text-dark mb-2">What Farmers Say</h2>
            <p className="text-text-gray text-base">Real experiences from real farmers across Maharashtra</p>
          </div>
          {reviews.length === 0 && !loading ? (
            <div className="text-center py-16">
              <Star className="w-12 h-12 text-amber-300 mx-auto mb-3" />
              <p className="text-text-gray">Be the first to review our products!</p>
              <Link to="/reviews" className="mt-4 bg-primary-green text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-all inline-flex items-center gap-2 mt-4">
                Write a Review
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {reviews.map(review => (
                <div key={review._id} className="bg-white rounded-2xl shadow-premium p-4 hover:shadow-premium-hover transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={review.visitorPhoto ? (review.visitorPhoto.startsWith('http') ? review.visitorPhoto : `http://localhost:5000${review.visitorPhoto}`) : REVIEW_PLACEHOLDER}
                      alt={review.visitorName}
                      className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0"
                      onError={(e) => { e.target.src = REVIEW_PLACEHOLDER; }}
                    />
                    <div>
                      <p className="font-semibold text-text-dark text-sm leading-tight">{review.visitorName}</p>
                      <Stars rating={review.rating} size={3} />
                    </div>
                  </div>
                  <p className="text-text-gray text-xs line-clamp-4 leading-relaxed">{review.reviewText}</p>
                  {review.photos?.length > 0 && (
                    <div className="flex gap-1 mt-3">
                      {review.photos.slice(0, 3).map((photo, i) => (
                        <img key={i} src={photo.startsWith('http') ? photo : `http://localhost:5000${photo}`} alt=""
                          className="w-12 h-12 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/reviews" className="bg-primary-green text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2">
              <Star className="w-4 h-4" /> View All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-24 relative overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-6f296d1eb2e3?w=1600&q=80&fit=crop" 
            alt="Farm landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-dark/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
            Join 5000+ farmers who trust KBD Multiplier Dhule for quality agricultural products. Better yields start here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="bg-white text-primary-green font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:scale-105">
              Shop Now
            </Link>
            <Link to="/contact" className="border-2 border-white/60 text-white px-8 py-3.5 rounded-xl hover:bg-white/15 transition-all backdrop-blur-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
