import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../data/api';
import { Package, DollarSign, Warehouse, TrendingUp, ArrowUpRight, Plus, Activity } from 'lucide-react';

const CHART_COLORS = ['#f5a623', '#10162b', '#2f8f7a', '#d9820b'];

function ProviderDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [error, setError] = useState('');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      apiRequest('/products/analytics'),
      apiRequest('/auth/me'),
    ])
      .then(([analyticsResult, userResult]) => {
        if (analyticsResult.status === 'fulfilled') setAnalytics(analyticsResult.value);
        if (userResult.status === 'fulfilled') {
          return apiRequest('/products?per_page=100').then((productsData) => {
            const myProducts = productsData.products.filter(p => p.provider_id === userResult.value.user.id);
            setRecentProducts(myProducts.slice(0, 5));
          });
        }
      })
      .catch(() => {});
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
  }, []);

  const totalValue = analytics?.total_value || 0;
  const totalStock = analytics?.total_stock || 0;
  const productCount = analytics?.total_products || 0;

  const statCards = [
    { title: 'Products', value: productCount, icon: Package, change: '', color: '#f5a623' },
    { title: 'Inventory Value', value: `KSh ${(totalValue / 1000).toFixed(0)}k`, icon: DollarSign, change: '', color: '#2f8f7a' },
    { title: 'Total Stock', value: totalStock.toLocaleString(), icon: Warehouse, change: '', color: '#6366f1' },
    { title: 'Status', value: productCount ? 'Live' : 'Empty', icon: TrendingUp, change: '', color: '#d9820b' },
  ];

  const barData = (analytics?.day_labels || []).map((label, i) => ({
    label,
    orders: analytics.daily_data[i]?.orders || 0,
    revenue: analytics.daily_data[i]?.revenue || 0,
  }));
  const maxBar = Math.max(...barData.map((d) => Math.max(d.orders, d.revenue)), 1);

  const stockRate = analytics?.stock_rate || 0;

  return (
    <div className="p-8">
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#10162b]">Hello, Provider</h1>
          <p className="text-sm text-[#4a5565] mt-1">Here are the stats for today</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/provider/products/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f5a623] hover:bg-[#d9820b] text-white text-sm font-bold transition"
          >
            <Plus size={16} />
            Add product
          </Link>
          <div className="w-10 h-10 rounded-full bg-[#10162b] flex items-center justify-center text-white text-sm font-bold">
            P
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon size={18} style={{ color: card.color }} />
                </div>
                {card.change && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-green-600">
                    <ArrowUpRight size={14} />
                    {card.change}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#4a5565] mb-1">{card.title}</p>
              <strong className="text-2xl font-extrabold text-[#10162b]">{card.value}</strong>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mb-8">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-[#10162b]">Product Performance</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f5a623]" /> Orders</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10162b]" /> Revenue</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {barData.map((d, i) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex items-end gap-1 w-full" style={{ height: '160px' }}>
                  <div
                    className="flex-1 rounded-t-md transition-all duration-700 ease-out"
                    style={{ height: animated ? `${(d.orders / maxBar) * 100}%` : '0%', backgroundColor: CHART_COLORS[0], transitionDelay: `${i * 80}ms` }}
                  />
                  <div
                    className="flex-1 rounded-t-md transition-all duration-700 ease-out"
                    style={{ height: animated ? `${(d.revenue / maxBar) * 100}%` : '0%', backgroundColor: CHART_COLORS[1], transitionDelay: `${i * 80}ms` }}
                  />
                </div>
                <span className="text-xs text-[#4a5565] font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Circular progress */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-[#10162b] mb-6 self-start">Stock Target</h3>
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none" stroke="#2f8f7a" strokeWidth="10"
                strokeDasharray={`${animated ? (stockRate / 100) * 314 : 0} 314`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <strong className="text-3xl font-extrabold text-[#10162b]">{stockRate}%</strong>
            </div>
          </div>
          <p className="text-xs text-[#4a5565] text-center leading-relaxed">
            You completed {stockRate}% of your stock target.
          </p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        {/* Recent products */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-[#10162b]">Recent Products</h3>
            <Link to="/provider/products" className="text-xs font-bold text-[#f5a623] hover:text-[#d9820b] transition">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {product.image ? (
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={16} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#10162b] truncate">{product.name}</p>
                  <p className="text-xs text-[#4a5565]">KSh {product.price.toLocaleString()} · {product.stock} in stock</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">Active</span>
              </div>
            ))}
            {recentProducts.length === 0 && (
              <p className="text-sm text-[#4a5565] text-center py-6">No products yet.</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-bold text-[#10162b] mb-5">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/provider/products/add" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
              <div className="w-9 h-9 rounded-lg bg-[#f5a623]/10 flex items-center justify-center">
                <Plus size={16} className="text-[#f5a623]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#10162b]">Add new product</p>
                <p className="text-xs text-[#4a5565]">List a new item</p>
              </div>
            </Link>
            <Link to="/provider/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
              <div className="w-9 h-9 rounded-lg bg-[#2f8f7a]/10 flex items-center justify-center">
                <Package size={16} className="text-[#2f8f7a]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#10162b]">Manage inventory</p>
                <p className="text-xs text-[#4a5565]">Update stock levels</p>
              </div>
            </Link>
            <Link to="/customer/support" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
              <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                <Activity size={16} className="text-[#6366f1]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#10162b]">Support center</p>
                <p className="text-xs text-[#4a5565]">Get help</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
