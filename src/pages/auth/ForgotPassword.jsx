import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sun, ArrowLeft, CheckCircle } from 'lucide-react';
import { getApiUrl } from '../../data/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send reset link');
      }
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-8 md:p-10">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a5565] hover:text-[#10162b] transition mb-6">
          <ArrowLeft size={16} /> Back to login
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#d9820b] flex items-center justify-center text-white shadow-lg shadow-[#f5a623]/20">
            <Sun size={24} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#10162b] text-center mb-2">Reset your password</h1>
        <p className="text-sm text-[#4a5565] text-center mb-8">Enter your email and we'll send you a reset link</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>
        )}

        {sent ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-[#f5a623] mb-4" />
            <h2 className="text-lg font-bold text-[#10162b] mb-2">Check your email</h2>
            <p className="text-sm text-[#4a5565] mb-6">We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f5a623] hover:bg-[#d9820b] text-white text-sm font-bold transition">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#4a5565] mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-[#10162b] placeholder-gray-400 outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#f5a623] hover:bg-[#d9820b] disabled:opacity-50 text-white text-sm font-bold transition"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            <p className="text-sm text-[#4a5565] text-center mt-6">
              Remember your password? <Link to="/login" className="font-bold text-[#10162b] hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
