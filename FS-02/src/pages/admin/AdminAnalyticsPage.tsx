import React from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  CreditCard,
  Truck,
  RotateCcw,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { orders, products, categories, vendors } = useMarketStore();

  const totalGMV = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const aov = orders.length > 0 ? totalGMV / orders.length : 0;

  // Category distribution data
  const categoryData = categories.map((cat) => {
    const count = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
    return { name: cat.name, count };
  });

  // Payment method data
  const paymentData = [
    { name: 'Credit/Debit Card', count: orders.filter((o) => o.paymentMethod === 'card').length },
    { name: 'UPI / QR', count: orders.filter((o) => o.paymentMethod === 'upi').length },
    { name: 'Cash on Delivery', count: orders.filter((o) => o.paymentMethod === 'cod').length },
  ];

  // Vendor sales comparison
  const vendorSalesData = vendors.map((v) => {
    const sales = orders
      .filter((o) => o.orderStatus !== 'cancelled')
      .reduce((acc, o) => {
        const itemSum = o.items
          .filter((i) => i.vendorId === v.id)
          .reduce((s, it) => s + it.subtotal, 0);
        return acc + itemSum;
      }, 0);
    return {
      name: v.storeName.split(' ')[0],
      sales: Math.round(sales),
    };
  });

  const monthlyGrowth = [
    { month: 'Sep', revenue: 4200, fee: 420 },
    { month: 'Oct', revenue: 6100, fee: 610 },
    { month: 'Nov', revenue: 8400, fee: 840 },
    { month: 'Dec', revenue: 14200, fee: 1420 },
    { month: 'Jan', revenue: 9800, fee: 980 },
    { month: 'Feb', revenue: Math.round(totalGMV), fee: Math.round(totalGMV * 0.1) },
  ];

  const COLORS = ['#0f233a', '#f97316', '#10b981', '#6366f1', '#e11d48', '#d97706'];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Marketplace Deep Analytics & Intelligence
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time transactional metrics, payment rails distribution, and vendor market share
        </p>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Average Order Value (AOV)
          </span>
          <div className="text-2xl font-black text-slate-900">${aov.toFixed(2)}</div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">High basket value</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Settled Order Success
          </span>
          <div className="text-2xl font-black text-emerald-600">
            {(
              (orders.filter((o) => o.orderStatus !== 'cancelled').length / orders.length) *
              100
            ).toFixed(0)}
            %
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Minimal return & dispute rate</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Avg Turnaround Time
          </span>
          <div className="text-2xl font-black text-blue-600">2.8 Days</div>
          <p className="text-[10px] text-slate-400 mt-1">From order placement to doorstep</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Customer Repeat Rate
          </span>
          <div className="text-2xl font-black text-brand-accent">68.4%</div>
          <p className="text-[10px] text-slate-400 mt-1">Shoppers returning within 30 days</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* GMV Growth Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Transaction Volume & Net Fee (6-Month Scale)
            </h3>
            <span className="text-xs text-brand-accent font-bold">USD</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f233a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0f233a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a1726', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" name="Total GMV ($)" stroke="#0f233a" strokeWidth={3} fill="url(#gRevenue)" />
                <Area type="monotone" dataKey="fee" name="Commission ($)" stroke="#10b981" strokeWidth={2} fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Market Share Bar Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Merchant Revenue Leaderboard</h3>
            <p className="text-xs text-slate-500">Gross sales volume by merchant store</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`$${val}`, 'Gross Sales']}
                  contentStyle={{ backgroundColor: '#0a1726', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="sales" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Payment Methods & Department Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Rails */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Checkout Payment Rails Share</h3>
            <p className="text-xs text-slate-500">Orders split across simulated payment gateways</p>
          </div>

          <div className="space-y-3 pt-2">
            {paymentData.map((item, idx) => {
              const pct = orders.length > 0 ? (item.count / orders.length) * 100 : 0;
              return (
                <div key={item.name} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">{item.name}</span>
                    <span className="text-slate-900 font-bold">
                      {item.count} orders ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Department Catalog Breakdown</h3>
            <p className="text-xs text-slate-500">Listed items across 8 departments</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {categoryData.map((c, i) => (
              <div
                key={c.name}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-700 truncate">{c.name}</span>
                <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md shadow-xs">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
