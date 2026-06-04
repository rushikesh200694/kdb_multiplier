import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-gray">Loading...</p>
      </div>
    </div>
  );
  return admin ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;
