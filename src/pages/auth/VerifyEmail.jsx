import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Sun } from 'lucide-react';
import { getApiUrl } from '../../data/api';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    fetch(getApiUrl('/auth/verify-email'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (res.ok) setStatus('success');
        else setStatus('error');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-8 md:p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#d9820b] flex items-center justify-center text-white shadow-lg shadow-[#f5a623]/20">
            <Sun size={24} />
          </div>
        </div>

        {status === 'verifying' && (
          <>
            <div className="w-8 h-8 border-4 border-[#f5a623] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#10162b] mb-2">Verifying your email...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="mx-auto text-[#22c55e] mb-4" />
            <h1 className="text-2xl font-bold text-[#10162b] mb-2">Email verified!</h1>
            <p className="text-sm text-[#4a5565] mb-6">Your account is now active. You can sign in.</p>
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5a623] hover:bg-[#d9820b] text-white text-sm font-bold transition">
              Sign in
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h1 className="text-2xl font-bold text-[#10162b] mb-2">Verification failed</h1>
            <p className="text-sm text-[#4a5565] mb-6">This link is invalid or has expired.</p>
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5a623] hover:bg-[#d9820b] text-white text-sm font-bold transition">
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
