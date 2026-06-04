import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const CustomerProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-gray">Loading your farm space...</p>
      </div>
    </div>
  );

  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default CustomerProtectedRoute;
