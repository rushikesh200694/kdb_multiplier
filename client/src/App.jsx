import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppBtn from './components/WhatsAppBtn';
import CreatorBadge from './components/CreatorBadge';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerProtectedRoute from './components/CustomerProtectedRoute';

// Eager load Home for immediate display
import Home from './pages/Home';

// Lazy load other routes
const Login = lazy(() => import('./pages/Login'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Visits = lazy(() => import('./pages/Visits'));
const VisitDetail = lazy(() => import('./pages/VisitDetail'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Contact = lazy(() => import('./pages/Contact'));
const Orders = lazy(() => import('./pages/Orders'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy load admin routes
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminVisits = lazy(() => import('./pages/admin/AdminVisits'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));

const LoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const CustomerLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </main>
    <Footer />
    <WhatsAppBtn />
  </div>
);

function App() {
  return (
    <AdminProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Customer Routes */}
              <Route path="/login" element={<Suspense fallback={<LoadingFallback />}><Login /></Suspense>} />
              <Route path="/" element={<CustomerProtectedRoute><CustomerLayout><Home /></CustomerLayout></CustomerProtectedRoute>} />
              <Route path="/products" element={<CustomerProtectedRoute><CustomerLayout><Products /></CustomerLayout></CustomerProtectedRoute>} />
              <Route path="/products/:id" element={<CustomerProtectedRoute><CustomerLayout><ProductDetail /></CustomerLayout></CustomerProtectedRoute>} />
              <Route path="/cart" element={<CustomerProtectedRoute><CustomerLayout><Cart /></CustomerLayout></CustomerProtectedRoute>} />
              <Route path="/checkout" element={<CustomerProtectedRoute><CustomerLayout><Checkout /></CustomerLayout></CustomerProtectedRoute>} />
              <Route path="/visits" element={<CustomerProtectedRoute><CustomerLayout><Visits /></CustomerLayout></CustomerProtectedRoute>} />
              <Route path="/visits/:id" element={<CustomerProtectedRoute><CustomerLayout><VisitDetail /></CustomerLayout></CustomerProtectedRoute>} />
              <Route path="/reviews" element={<CustomerProtectedRoute><CustomerLayout><Reviews /></CustomerLayout></CustomerProtectedRoute>} />
              <Route path="/contact" element={<CustomerProtectedRoute><CustomerLayout><Contact /></CustomerLayout></CustomerProtectedRoute>} />
              <Route path="/orders" element={<CustomerProtectedRoute><CustomerLayout><Orders /></CustomerLayout></CustomerProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin-login" element={<Suspense fallback={<LoadingFallback />}><AdminLogin /></Suspense>} />
              <Route path="/admin" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AdminProducts /></Suspense></ProtectedRoute>} />
              <Route path="/admin/visits" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AdminVisits /></Suspense></ProtectedRoute>} />
              <Route path="/admin/reviews" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AdminReviews /></Suspense></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AdminOrders /></Suspense></ProtectedRoute>} />
              <Route path="/admin/banners" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AdminBanners /></Suspense></ProtectedRoute>} />
              <Route path="*" element={<CustomerProtectedRoute><CustomerLayout><NotFound /></CustomerLayout></CustomerProtectedRoute>} />
            </Routes>
            <CreatorBadge />
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </AdminProvider>
  );
}

export default App;
