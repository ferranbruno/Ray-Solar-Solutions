import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, Sun, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '../../data/api';

const roleRoutes = {
  customer: '/customer',
  provider: '/provider',
  admin: '/admin',
};

function getStoredRole() {
  return localStorage.getItem('ray-solar-role') || '';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (getStoredRole()) {
    const role = getStoredRole();
    return <Navigate to={roleRoutes[role] || '/customer'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });

      const accountRole = data.user.role.toLowerCase();
      const destination = roleRoutes[accountRole] || '/customer';

      localStorage.setItem('ray-solar-role', accountRole);
      localStorage.setItem('ray-solar-access-token', data.access_token);
      localStorage.setItem('ray-solar-refresh-token', data.refresh_token);
      navigate(destination);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-8 md:p-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#f5a623] flex items-center justify-center shadow-lg shadow-orange-200">
            <Sun className="text-white" size={30} strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-[#10162b] leading-tight mb-2">
          Welcome back
        </h1>
        <p className="text-center text-[#4a5565] text-sm mb-8 leading-relaxed">
          Sign in to your Ray Solar Solutions account
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-[#10162b] mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f5a623]" size={18} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-[#f1e6d6] bg-[#faf6ee] text-sm placeholder:text-[#B0B4BA] focus:outline-none focus:border-[#f5a623] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#10162b] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f5a623]" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                required
                className="w-full pl-11 pr-11 py-3.5 rounded-xl border-2 border-[#f1e6d6] bg-[#faf6ee] text-sm placeholder:text-[#B0B4BA] focus:outline-none focus:border-[#f5a623] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B0B4BA] hover:text-[#4a5565] transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-sm text-[#d9820b] font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f5a623] hover:bg-[#d9820b] text-white font-bold py-3.5 rounded-xl text-[15px] mt-2 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#4a5565] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#d9820b] font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
