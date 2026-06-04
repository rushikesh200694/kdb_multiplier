import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { productAPI } from '../api/index.js';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Fertilizers', 'Multilayers', 'Ayurvedic Medicines', 'Soaps', 'Organic Products', 'Crop Nutrients', 'Pest Control', 'Soil Improvement'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    productAPI.getAll()
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];
    if (category !== 'All') result = result.filter(p => p.category === category);
    if (search.trim()) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [products, search, category]);

  useEffect(() => {
    const q = searchParams.get('search');
    const cat = searchParams.get('category');
    if (q) setSearch(q);
    if (cat) setCategory(cat);
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <title>Products – KBD Multiplier Dhule</title>
      <meta name="description" content="Browse our complete range of agricultural products including fertilizers, Ayurvedic medicines, organic solutions and more." />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-1">Our Products</h1>
        <p className="text-text-gray">Find the right agricultural solution for your farm</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-12"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-gray hover:text-text-dark">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="md:hidden flex items-center gap-2 border border-border rounded-xl px-4 py-3 text-sm font-medium text-text-dark hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Category Tabs - Desktop */}
      <div className="hidden md:flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              category === cat
                ? 'bg-primary-green text-white shadow-md'
                : 'bg-white border border-border text-text-gray hover:border-primary-green hover:text-primary-green'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category Dropdown - Mobile */}
      {showFilter && (
        <div className="md:hidden flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setShowFilter(false); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                category === cat ? 'bg-primary-green text-white' : 'bg-white border border-border text-text-gray'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results info */}
      {!loading && (
        <p className="text-text-gray text-sm mb-5">
          Showing <span className="font-semibold text-text-dark">{filtered.length}</span> products
          {category !== 'All' && <span> in <span className="text-primary-green font-medium">{category}</span></span>}
        </p>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🌾</div>
          <h3 className="text-lg font-semibold text-text-dark mb-2">No products found</h3>
          <p className="text-text-gray">Try a different search or category</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-4 btn-outline text-sm">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
