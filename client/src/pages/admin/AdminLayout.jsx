import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, Package, MapPin, Star, ShoppingBag, LogOut, Menu, LayoutGrid } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/visits', label: 'Visits', icon: MapPin },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/banners', label: 'Banners', icon: LayoutGrid },
];

const AdminLayout = ({ children }) => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin-login'); };

  const isActive = (item) => item.exact
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to);

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-primary-dark text-white w-64">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-light" />
          </div>
          <div>
            <p className="font-bold text-sm">KBD Admin</p>
            <p className="text-white/50 text-xs">Management Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive({ to, exact })
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">
            {admin?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-medium">{admin?.name}</p>
            <p className="text-white/40 text-xs">{admin?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-border flex items-center justify-between px-5 py-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <p className="font-semibold text-text-dark text-sm">KBD Multiplier Dhule — Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="text-xs text-text-gray hover:text-primary-green transition-colors border border-border px-3 py-1.5 rounded-lg">
              View Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
