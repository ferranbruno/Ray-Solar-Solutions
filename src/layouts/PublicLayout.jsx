import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import GlobalSidebar from '../components/layout/GlobalSidebar';

const TOKEN_KEY = 'ray-solar-access-token';
const ROLE_KEY = 'ray-solar-role';

function PublicLayout() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem(TOKEN_KEY));
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem(TOKEN_KEY));
  }, [location.pathname]);

  useEffect(() => {
    const onPopState = () => setLoggedIn(!!localStorage.getItem(TOKEN_KEY));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('ray-solar-refresh-token');
    localStorage.removeItem(ROLE_KEY);
    setMenuOpen(false);
    navigate('/');
  };

  const role = localStorage.getItem(ROLE_KEY);
  const profilePath = role === 'admin' ? '/admin/profile' : role === 'provider' ? '/provider/profile' : '/customer/profile';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-[rgba(16,22,43,0.92)] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[82px] px-6 gap-5">
          <Link to="/" className="inline-flex items-center gap-3 font-bold tracking-wide text-white">
            <span className="text-2xl text-[#f5a623]">☀</span>
            <span>Ray Solar <strong className="text-[#f5a623]">Solutions</strong></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/75">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/products" className="hover:text-white transition">Products</Link>
            <Link to="/about" className="hover:text-white transition">About</Link>
          </nav>

          <div className="flex items-center gap-3 relative">
            {loggedIn ? (
              <>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f5a623] to-[#d9820b] flex items-center justify-center text-white text-xs font-bold">
                    <User size={14} />
                  </div>
                  <ChevronDown size={14} />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a2240] border border-white/10 rounded-xl shadow-2xl z-40 py-2 overflow-hidden">
                      <Link
                        to={profilePath}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
                      >
                        <User size={15} /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition w-full"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition">Login</Link>
                <Link to="/register" className="px-5 py-2.5 rounded-xl bg-[#f5a623] hover:bg-[#d9820b] text-white text-sm font-bold transition">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 ml-[72px]">
        <Outlet />
      </main>

      <footer className="bg-[#10162b] text-white/70 ml-[72px]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 py-14">
          <div>
            <div className="flex items-center gap-3 font-bold text-white mb-4">
              <span className="text-xl">☀</span>
              <span>Ray Solar</span>
            </div>
            <p className="text-sm leading-relaxed">Brightening communities with sustainable solar lighting for homes, workspaces and public areas.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Explore</h4>
            <ul className="grid gap-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              {!loggedIn && <li><Link to="/login" className="hover:text-white transition">Login</Link></li>}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="grid gap-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/support" className="hover:text-white transition">Support</Link></li>
              <li><a href="mailto:hello@raysolar.co" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="grid gap-2 text-sm">
              <li><a href="mailto:hello@raysolar.co" className="hover:text-white transition">hello@raysolar.co</a></li>
              <li><a href="tel:+254700000000" className="hover:text-white transition">+254 700 000 000</a></li>
              <li>Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs py-5 border-t border-white/[0.08]">© 2026 Ray Solar Solutions. Powered by clean energy.</div>
      </footer>

      <GlobalSidebar />
    </div>
  );
}

export default PublicLayout;
