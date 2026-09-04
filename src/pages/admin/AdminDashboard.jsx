import { useEffect, useState } from 'react';
import { apiRequest } from '../../data/api';
import { Users, UserCheck, Building2, Package, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, ShoppingCart } from 'lucide-react';

const CHART_COLORS = ['#f5a623', '#10162b', '#2f8f7a', '#d9820b', '#6366f1'];

function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_customers: 0,
    total_providers: 0,
    total_products: 0,
    daily_orders: [],
    daily_users: [],
    day_labels: [],
  });
  const [error, setError] = useState('');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    apiRequest('/admin/analytics')
      .then((data) => setMetrics(data))
      .catch(() => {});
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
  }, []);

  const statCards = [
    { title: 'Total Users', value: metrics.total_users, icon: Users, change: '+12%', up: true, color: '#f5a623' },
    { title: 'Customers', value: metrics.total_customers, icon: UserCheck, change: '+8%', up: true, color: '#2f8f7a' },
    { title: 'Providers', value: metrics.total_providers, icon: Building2, change: '+3%', up: true, color: '#6366f1' },
    { title: 'Products', value: metrics.total_products, icon: Package, change: '+5%', up: true, color: '#d9820b' },
  ];

  const barData = (metrics.day_labels || []).map((label, i) => ({
    label,
    orders: metrics.daily_orders[i]?.orders || 0,
    revenue: metrics.daily_orders[i]?.revenue || 0,
    users: metrics.daily_users?.[i] || 0,
  }));
  const maxBar = Math.max(...barData.map((d) => Math.max(d.users, d.orders, d.revenue)), 1);

  const approvalRate = metrics.total_products > 0
    ? Math.round((metrics.total_products / (metrics.total_products + 2)) * 100)
    : 65;

  const recentActivity = [
    { name: 'New user registered', time: '2 min ago', type: 'user' },
    { name: 'Product submitted for review', time: '15 min ago', type: 'product' },
    { name: 'Provider verified', time: '1 hour ago', type: 'provider' },
    { name: 'New order placed', time: '2 hours ago', type: 'order' },
    { name: 'Support ticket created', time: '3 hours ago', type: 'support' },
  ];

  const activityColors = { user: '#2f8f7a', product: '#f5a623', provider: '#6366f1', order: '#10162b', support: '#d9820b' };

  return (
    <div className="p-8">
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#10162b]">Hello, Admin</h1>
          <p className="text-sm text-[#4a5565] mt-1">Here are the stats for today</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#10162b] flex items-center justify-center text-white text-sm font-bold">
            A
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
                <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                  {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.change}
                </span>
              </div>
              <p className="text-sm text-[#4a5565] mb-1">{card.title}</p>
              <strong className="text-2xl font-extrabold text-[#10162b]">{card.value.toLocaleString()}</strong>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mb-8">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-[#10162b]">Impressions</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f5a623]" /> Users</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10162b]" /> Orders</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {barData.map((d, i) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex items-end gap-1 w-full" style={{ height: '160px' }}>
                  <div
                    className="flex-1 rounded-t-md transition-all duration-700 ease-out"
                    style={{ height: animated ? `${(d.users / maxBar) * 100}%` : '0%', backgroundColor: CHART_COLORS[0], transitionDelay: `${i * 80}ms` }}
                  />
                  <div
                    className="flex-1 rounded-t-md transition-all duration-700 ease-out"
                    style={{ height: animated ? `${(d.orders / maxBar) * 100}%` : '0%', backgroundColor: CHART_COLORS[1], transitionDelay: `${i * 80}ms` }}
                  />
                </div>
                <span className="text-xs text-[#4a5565] font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Circular progress */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-[#10162b] mb-6 self-start">Target Percent</h3>
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none" stroke="#f5a623" strokeWidth="10"
                strokeDasharray={`${animated ? (approvalRate / 100) * 314 : 0} 314`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <strong className="text-3xl font-extrabold text-[#10162b]">{approvalRate}%</strong>
            </div>
          </div>
          <p className="text-xs text-[#4a5565] text-center leading-relaxed">
            You completed {approvalRate}% of your target this month.
          </p>
        </div>
      </div>

      {/* Activity + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        {/* Activity feed */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-[#10162b]">Activity Feed</h3>
            <span className="text-xs text-[#4a5565] font-medium flex items-center gap-1">
              <Activity size={14} /> All Activity
            </span>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: activityColors[item.type] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#10162b] font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent stats summary */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-bold text-[#10162b] mb-5">Platform Summary</h3>
          <div className="space-y-4">
            {[
              { label: 'Total Users', value: metrics.total_users, icon: Users, color: '#f5a623' },
              { label: 'Customers', value: metrics.total_customers, icon: UserCheck, color: '#2f8f7a' },
              { label: 'Providers', value: metrics.total_providers, icon: Building2, color: '#6366f1' },
              { label: 'Products', value: metrics.total_products, icon: Package, color: '#d9820b' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                    <Icon size={16} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#10162b]">{item.label}</p>
                  </div>
                  <strong className="text-sm font-bold text-[#10162b]">{item.value.toLocaleString()}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
