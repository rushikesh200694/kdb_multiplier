import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, Search, Leaf, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/visits', label: 'Visits' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/contact', label: 'Contact' },
    ...(user ? [{ to: '/orders', label: 'My Orders' }] : [])
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-green to-primary-light rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-primary-green text-base leading-tight block">KBD Multiplier</span>
              <span className="text-text-gray text-xs leading-tight">Dhule</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-text-gray hover:text-primary-green transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-primary-green bg-primary-green/10'
                    : 'text-text-dark hover:text-primary-green hover:bg-primary-green/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 ml-4">
            {user && (
              <span className="hidden md:inline text-xs font-semibold text-text-dark bg-gray-100 px-3 py-1.5 rounded-xl">
                Hi, {user.name.split(' ')[0]}
              </span>
            )}
            <Link to="/reviews" className="hidden md:flex p-2 rounded-xl text-text-gray hover:text-primary-green hover:bg-primary-green/10 transition-all">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to="/cart" id="cart-icon" className="relative p-2 rounded-xl text-text-gray hover:text-primary-green hover:bg-primary-green/10 transition-all">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            {user && (
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="hidden md:flex p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer border-none"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            <Link to="/products" className="hidden md:inline-flex btn-primary text-sm py-2 px-4">
              Shop Now
            </Link>
            {/* Mobile menu */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-xl text-text-dark hover:bg-gray-100 transition-all">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/30"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-gray">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-border mt-1 pt-3">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'text-primary-green bg-primary-green/10'
                      : 'text-text-dark hover:text-primary-green hover:bg-primary-green/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/products" className="mt-2 btn-primary text-sm justify-center">
                Shop Now
              </Link>
              {user && (
                <div className="border-t border-border mt-3 pt-3 px-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-dark">Hi, {user.name}</span>
                  <button
                    onClick={() => logout()}
                    className="text-xs text-red-500 hover:underline flex items-center gap-1 font-bold cursor-pointer border-none bg-transparent"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
