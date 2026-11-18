import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { OrderStatusBadge, VendorStatusBadge } from '../../components/common/Badge';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Package,
  Percent,
  TrendingUp,
  AlertTriangle,
  Check,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const AdminOverviewPage: React.FC = () => {
  const { orders, customers, vendors, products, updateVendorStatus } = useMarketStore();

  // Financial aggregates
  const totalSales = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const platformCommissionEarned = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((acc, o) => {
      const itemsFee = o.items.reduce((sum, item) => sum + item.platformCommission, 0);
      return acc + itemsFee;
    }, 0);

  const pendingVendors = vendors.filter((v) => v.status === 'pending');

  const chartData = [
    { month: 'Sep', sales: Math.round(totalSales * 0.55), commission: Math.round(platformCommissionEarned * 0.55) },
    { month: 'Oct', sales: Math.round(totalSales * 0.70), commission: Math.round(platformCommissionEarned * 0.70) },
    { month: 'Nov', sales: Math.round(totalSales * 0.82), commission: Math.round(platformCommissionEarned * 0.82) },
    { month: 'Dec', sales: Math.round(totalSales * 1.15), commission: Math.round(platformCommissionEarned * 1.15) },
    { month: 'Jan', sales: Math.round(totalSales * 0.90), commission: Math.round(platformCommissionEarned * 0.90) },
    { month: 'Feb', sales: Math.round(totalSales), commission: Math.round(platformCommissionEarned) },
  ];

  const handleQuickApprove = (vendorId: string, storeName: string) => {
    updateVendorStatus(vendorId, 'approved');
    toast.success(`Vendor "${storeName}" has been approved!`);
  };

  const handleQuickReject = (vendorId: string, storeName: string) => {
    updateVendorStatus(vendorId, 'rejected');
    toast.error(`Vendor "${storeName}" application rejected.`);
  };

  return (
    <div className="space-y-8">
      {/* Pending Vendor Alert Notice */}
      {pendingVendors.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-300 text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {pendingVendors.length} Vendor Application(s) Awaiting Admin Decision
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                New merchants seeking authorization to sell on MarketHub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {pendingVendors.map((v) => (
              <div key={v.id} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs">
                <span className="font-bold text-slate-800">{v.storeName}</span>
                <button
                  onClick={() => handleQuickApprove(v.id, v.storeName)}
                  className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                  title="Approve"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleQuickReject(v.id, v.storeName)}
                  className="p-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800"
                  title="Reject"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Sales (GMV)
          </span>
          <div className="text-xl font-black text-slate-900">${totalSales.toFixed(2)}</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">+24% MoM</span>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Platform Cut
          </span>
          <div className="text-xl font-black text-emerald-600">
            ${platformCommissionEarned.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">From settled orders</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Global Orders
          </span>
          <div className="text-xl font-black text-slate-900">{orders.length}</div>
          <span className="text-[10px] text-slate-400 block mt-1">Across 5 vendors</span>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Shoppers
          </span>
          <div className="text-xl font-black text-slate-900">{customers.length}</div>
          <span className="text-[10px] text-slate-400 block mt-1">Registered accounts</span>
        </div>

        {/* Total Vendors */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Stores Listed
          </span>
          <div className="text-xl font-black text-slate-900">{vendors.length}</div>
          <span className="text-[10px] text-amber-600 font-bold block mt-1">
            {vendors.filter((v) => v.status === 'approved').length} Active
          </span>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Live Catalog
          </span>
          <div className="text-xl font-black text-slate-900">{products.length}</div>
          <span className="text-[10px] text-slate-400 block mt-1">Total items</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* GMV and Platform Commission Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Marketplace Growth & Commissions</h3>
              <p className="text-xs text-slate-500">Gross transaction volume vs net platform take</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              6-Month Trend
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f233a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0f233a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a1726', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" name="Gross Sales" stroke="#0f233a" strokeWidth={3} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="commission" name="Platform Commission" stroke="#10b981" strokeWidth={2} fill="url(#colorComm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Breakdown Bar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Vendor Sales Distribution</h3>
            <p className="text-xs text-slate-500">Gross revenue by merchant</p>
          </div>

          <div className="space-y-3 pt-2">
            {vendors.map((v) => {
              const vendorSales = orders
                .filter((o) => o.orderStatus !== 'cancelled')
                .reduce((acc, o) => {
                  const itemsTotal = o.items
                    .filter((i) => i.vendorId === v.id)
                    .reduce((sum, item) => sum + item.subtotal, 0);
                  return acc + itemsTotal;
                }, 0);

              const pct = totalSales > 0 ? (vendorSales / totalSales) * 100 : 0;

              return (
                <div key={v.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800 truncate max-w-[160px]">{v.storeName}</span>
                    <span className="text-slate-900 font-bold">${vendorSales.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Global Orders */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Global Orders</h3>
            <p className="text-xs text-slate-500">Cross-vendor marketplace fulfillment feed</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
          >
            <span>View All ({orders.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items / Vendors</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Platform Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.slice(0, 6).map((order) => {
                const totalCommission = order.items.reduce(
                  (sum, i) => sum + i.platformCommission,
                  0
                );

                return (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {order.items.length} item(s) • {order.items[0]?.vendorName}
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-600">
                      +${totalCommission.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <OrderStatusBadge status={order.orderStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
