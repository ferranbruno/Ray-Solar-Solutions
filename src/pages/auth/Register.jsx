import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User, Phone, Mail, Lock, ChevronDown, Sun, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '../../data/api';

const roleRoutes = {
  customer: '/customer',
  provider: '/provider',
};

function getStoredRole() {
  return localStorage.getItem('ray-solar-role') || '';
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
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
    const phone = formData.get('phone') || '';
    const phoneRegex = /^(?:\+?254|0)?[17]\d{8}$/;

    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError('Please enter a valid Kenyan phone number (e.g. 0712345678)');
      setIsSubmitting(false);
      return;
    }

    const fullName = formData.get('full_name') || '';
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    if (!firstName) {
      setError('Please enter your full name');
      setIsSubmitting(false);
      return;
    }

    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName || firstName,
          email: formData.get('email'),
          phone: phone.replace(/\s/g, ''),
          password: formData.get('password'),
          role: role.toUpperCase(),
        }),
      });

      localStorage.setItem('ray-solar-role', role);
      navigate('/login');
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
          Create your account
        </h1>
        <p className="text-center text-[#4a5565] text-sm mb-8 leading-relaxed">
          Join Ray Solar Solutions and power your home with clean energy.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-[#10162b] mb-1.5">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f5a623]" size={18} />
              <input
                type="text"
                name="full_name"
                placeholder="Your full name"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-[#f1e6d6] bg-[#faf6ee] text-sm placeholder:text-[#B0B4BA] focus:outline-none focus:border-[#f5a623] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#10162b] mb-1.5">
              I want to
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none px-4 pr-10 py-3.5 rounded-xl border-2 border-[#f1e6d6] bg-[#faf6ee] text-sm text-[#10162b] focus:outline-none focus:border-[#f5a623] focus:bg-white transition"
              >
                <option value="customer">Buy solar products as a customer</option>
                <option value="provider">Sell solar products as a vendor</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#f5a623] pointer-events-none" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#10162b] mb-1.5">
              Phone number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f5a623]" size={18} />
              <input
                type="tel"
                name="phone"
                placeholder="07XX XXX XXX"
                required
                pattern="(?:\+?254|0)?[17]\d{8}"
                title="Enter a valid Kenyan phone number (e.g. 0712345678)"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-[#f1e6d6] bg-[#faf6ee] text-sm placeholder:text-[#B0B4BA] focus:outline-none focus:border-[#f5a623] focus:bg-white transition"
              />
            </div>
          </div>

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
                placeholder="Create a password"
                required
                minLength={6}
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
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#4a5565] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#d9820b] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
