import { NavLink } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  User,
  Headphones,
  LayoutDashboard,
  Users,
  Building2,
  Package,
  LogOut,
  LogIn,
  UserPlus,
  Info,
  Mail,
} from 'lucide-react';

const ROLE_KEY = 'ray-solar-role';

const publicLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: ShoppingBag, label: 'Products' },
  { to: '/about', icon: Info, label: 'About' },
  { to: '/support', icon: Headphones, label: 'Support' },
  { to: '/login', icon: LogIn, label: 'Login' },
  { to: '/register', icon: UserPlus, label: 'Register' },
];

const customerLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: ShoppingBag, label: 'Products' },
  { to: '/about', icon: Info, label: 'About' },
  { to: '/customer', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customer/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/customer/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/customer/profile', icon: User, label: 'Profile' },
  { to: '/customer/support', icon: Headphones, label: 'Support' },
];

const providerLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: ShoppingBag, label: 'Products' },
  { to: '/about', icon: Info, label: 'About' },
  { to: '/support', icon: Headphones, label: 'Support' },
  { to: '/provider', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/provider/products', icon: Package, label: 'My products' },
  { to: '/provider/profile', icon: User, label: 'Profile' },
  { to: '/customer/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/customer/orders', icon: ClipboardList, label: 'Orders' },
];

const adminLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: ShoppingBag, label: 'Products' },
  { to: '/about', icon: Info, label: 'About' },
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/providers', icon: Building2, label: 'Providers' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/messages', icon: Mail, label: 'Messages' },
  { to: '/customer/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/customer/orders', icon: ClipboardList, label: 'Orders' },
];

function getLinks() {
  const role = localStorage.getItem(ROLE_KEY);
  if (role === 'admin') return adminLinks;
  if (role === 'provider') return providerLinks;
  if (role === 'customer') return customerLinks;
  return publicLinks;
}

export default function GlobalSidebar() {
  const links = getLinks();
  const role = localStorage.getItem(ROLE_KEY);

  const handleLogout = () => {
    localStorage.removeItem('ray-solar-role');
    localStorage.removeItem('ray-solar-access-token');
    localStorage.removeItem('ray-solar-refresh-token');
    window.location.href = '/login';
  };

  return (
    <aside className="fixed top-[82px] left-0 w-[72px] h-[calc(100vh-82px)] flex flex-col gap-3 py-3.5 px-3 bg-gradient-to-b from-[rgba(16,22,43,0.98)] to-[rgba(27,36,71,0.95)] border-r-0 border border-white/[0.08] shadow-2xl overflow-hidden z-21">
      <div className="flex items-center justify-center h-[62px] border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-[10px] bg-white/[0.12] text-[#f5a623] text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">☀</div>
      </div>

      <nav className="flex flex-col gap-1.5 pt-1.5">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              title={item.label}
              end={item.to === '/' || item.to === '/customer' || item.to === '/admin' || item.to === '/provider'}
              className={({ isActive }) =>
                `flex items-center justify-center min-h-[38px] rounded-[10px] transition-colors ${
                  isActive
                    ? 'bg-white/[0.12] text-white'
                    : 'text-[#f5a623] hover:bg-white/[0.06] hover:text-white'
                }`
              }
            >
              <Icon size={16} />
            </NavLink>
          );
        })}
      </nav>

      {role && (
        <div className="mt-auto pt-2 border-t border-white/[0.08]">
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center justify-center min-h-[38px] w-full rounded-[10px] text-[#f5a623] hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
