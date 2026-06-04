import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🌾</div>
        <h1 className="text-6xl font-black text-primary-green mb-2">404</h1>
        <h2 className="text-2xl font-bold text-text-dark mb-3">Page Not Found</h2>
        <p className="text-text-gray mb-8 leading-relaxed">
          Looks like this field hasn't been cultivated yet. Let's get you back to fertile ground.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary justify-center">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/products" className="btn-outline justify-center">
            <Leaf className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
