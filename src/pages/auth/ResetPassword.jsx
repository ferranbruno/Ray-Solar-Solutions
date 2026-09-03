import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Sun, ArrowLeft, CheckCircle } from 'lucide-react';
import { getApiUrl } from '../../data/api';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reset password');
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-8 text-center">
          <h1 className="text-2xl font-bold text-[#10162b] mb-2">Invalid link</h1>
          <p className="text-sm text-[#4a5565] mb-6">This password reset link is invalid.</p>
          <Link to="/forgot-password" className="inline-flex px-6 py-3 rounded-xl bg-[#f5a623] hover:bg-[#d9820b] text-white text-sm font-bold transition">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

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

        <h1 className="text-2xl font-bold text-[#10162b] text-center mb-2">Set new password</h1>
        <p className="text-sm text-[#4a5565] text-center mb-8">Enter your new password below</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>
        )}

        {success ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-[#22c55e] mb-4" />
            <h2 className="text-lg font-bold text-[#10162b] mb-2">Password reset!</h2>
            <p className="text-sm text-[#4a5565] mb-6">Your password has been updated.</p>
            <Link to="/login" className="inline-flex px-6 py-3 rounded-xl bg-[#f5a623] hover:bg-[#d9820b] text-white text-sm font-bold transition">
              Sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#4a5565] mb-1.5">New password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-[#10162b] placeholder-gray-400 outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-[#4a5565] mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-[#10162b] placeholder-gray-400 outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#f5a623] hover:bg-[#d9820b] disabled:opacity-50 text-white text-sm font-bold transition"
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
