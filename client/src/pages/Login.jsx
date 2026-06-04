import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Leaf, LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const { user, login, register } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (isLoginTab) {
        if (!authForm.email || !authForm.password) {
          setAuthError('Please fill in all fields.');
          setAuthLoading(false);
          return;
        }
        await login(authForm.email, authForm.password);
      } else {
        if (!authForm.name || !authForm.email || !authForm.password) {
          setAuthError('Please fill in all fields.');
          setAuthLoading(false);
          return;
        }
        await register(authForm.name, authForm.email, authForm.password);
      }
    } catch (err) {
      console.error('Auth error details:', err);
      const serverMessage = err.response?.data?.message;
      const serverError = err.response?.data?.error;
      const statusText = err.response?.statusText;
      const statusCode = err.response?.status;
      setAuthError(
        serverMessage 
          ? `${serverMessage}${serverError ? ` - ${serverError}` : ''}` 
          : `Error ${statusCode || 'unknown'}: ${statusText || 'Network error / Server crashed'}. Please check console/logs.`
      );
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-50 via-white to-emerald-50 px-4 py-12 relative overflow-hidden">
      {/* Decorative nature circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-green to-primary-light rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-bounce">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-text-dark tracking-tight">KBD Multiplier</h1>
          <p className="text-text-gray text-sm mt-1.5">Your Trusted Partner in Organic & High-Yield Farming</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            <button
              type="button"
              onClick={() => { setIsLoginTab(true); setAuthError(''); }}
              className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                isLoginTab ? 'border-primary-green text-primary-green' : 'border-transparent text-text-gray hover:text-text-dark'
              }`}
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLoginTab(false); setAuthError(''); }}
              className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                !isLoginTab ? 'border-primary-green text-primary-green' : 'border-transparent text-text-gray hover:text-text-dark'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Create Account
            </button>
          </div>

          <h3 className="font-extrabold text-text-dark text-xl mb-1.5">
            {isLoginTab ? 'Welcome Back!' : 'Start Your Journey'}
          </h3>
          <p className="text-text-gray text-xs mb-6">
            {isLoginTab
              ? 'Sign in to access your organic products catalog, reviews, and farm logs.'
              : 'Create your free farmer account to buy inputs, track deliveries, and write reviews.'}
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="text-xs font-semibold text-text-dark mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                  placeholder="Farmer / Business Name"
                  className="input-field py-2.5 text-sm"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-text-dark mb-1 block">Email Address *</label>
              <input
                type="email"
                value={authForm.email}
                onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                placeholder="name@example.com"
                className="input-field py-2.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-dark mb-1 block">Password *</label>
              <input
                type="password"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                placeholder="••••••••"
                className="input-field py-2.5 text-sm"
                required
              />
            </div>

            {authError && (
              <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-2xl border border-red-100 flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full btn-primary justify-center py-3 mt-4 shadow-md hover:shadow-lg text-sm rounded-2xl font-bold transition-all duration-200"
            >
              {authLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Please wait...
                </span>
              ) : (
                <span>{isLoginTab ? 'Sign In & Enter' : 'Create Account & Start'}</span>
              )}
            </button>
          </form>
        </div>

        {/* Back Link or Info */}
        <div className="text-center mt-6 text-xs text-text-gray">
          <span>Are you an administrator? </span>
          <Link to="/admin-login" className="text-primary-green hover:underline font-bold">Admin Portal</Link>
        </div>
      </div>
    </div>
  );
}
