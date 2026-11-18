import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { OrderStatusBadge, StockBadge } from '../../components/common/Badge';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Boxes,
  Store,
  ChevronRight,
  AlertTriangle,
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

export const VendorOverviewPage: React.FC = () => {
  const { selectedVendorId } = useAuthStore();
  const { vendors, products, orders } = useMarketStore();

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  // Vendor's products
  const vendorProducts = products.filter((p) => p.vendorId === currentVendor.id);
  const lowStockCount = vendorProducts.filter((p) => p.stock <= 10).length;

  // Vendor's orders
  const vendorOrders = orders.filter((o) =>
    o.items.some((i) => i.vendorId === currentVendor.id)
  );

  // Compute vendor gross revenue and commission
  let grossRevenue = 0;
  let commissionDeducted = 0;
  let netEarnings = 0;

  vendorOrders.forEach((o) => {
    if (o.orderStatus !== 'cancelled') {
      o.items.forEach((item) => {
        if (item.vendorId === currentVendor.id) {
          grossRevenue += item.subtotal;
          commissionDeducted += item.platformCommission;
          netEarnings += item.vendorEarning;
        }
      });
    }
  });

  const pendingOrders = vendorOrders.filter(
    (o) => o.orderStatus === 'placed' || o.orderStatus === 'processing'
  );

  // Chart data for weekly sales
  const salesChartData = [
    { day: 'Mon', revenue: Math.round(grossRevenue * 0.12), orders: 3 },
    { day: 'Tue', revenue: Math.round(grossRevenue * 0.18), orders: 5 },
    { day: 'Wed', revenue: Math.round(grossRevenue * 0.14), orders: 4 },
    { day: 'Thu', revenue: Math.round(grossRevenue * 0.22), orders: 7 },
    { day: 'Fri', revenue: Math.round(grossRevenue * 0.15), orders: 4 },
    { day: 'Sat', revenue: Math.round(grossRevenue * 0.28), orders: 9 },
    { day: 'Sun', revenue: Math.round(grossRevenue * 0.25), orders: 8 },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Gross Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              ${grossRevenue.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% from last period</span>
            </div>
          </div>
        </div>

        {/* Net Earnings */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Net Vendor Payout</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              ${netEarnings.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              After {currentVendor.commissionRate}% platform fee (-${commissionDeducted.toFixed(2)})
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-brand-accent flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{vendorOrders.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {pendingOrders.length} pending dispatch
            </div>
          </div>
        </div>

        {/* Listed Products */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{vendorProducts.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {lowStockCount > 0 ? (
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {lowStockCount} items low in stock
                </span>
              ) : (
                'Healthy stock levels'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Revenue Trend Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Revenue Inflow</h3>
              <p className="text-xs text-slate-500">Gross store sales over the past 7 days</p>
            </div>
            <span className="text-xs font-bold text-brand-accent bg-orange-50 px-2.5 py-1 rounded-full">
              Live Real-Time
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVendorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`$${val}`, 'Gross Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVendorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Order Volume Bar Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Order Frequency</h3>
            <p className="text-xs text-slate-500">Volume breakdown by weekday</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="orders" fill="#0f233a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Store Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500">Orders containing products fulfilled by {currentVendor.storeName}</p>
          </div>
          <Link
            to="/vendor/orders"
            className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
          >
            <span>View All ({vendorOrders.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {vendorOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Ordered</th>
                  <th className="py-3 px-4">Gross Total</th>
                  <th className="py-3 px-4">Your Earning</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vendorOrders.slice(0, 5).map((order) => {
                  const vendorItems = order.items.filter((i) => i.vendorId === currentVendor.id);
                  const storeSubtotal = vendorItems.reduce((acc, i) => acc + i.subtotal, 0);
                  const storeEarnings = vendorItems.reduce((acc, i) => acc + i.vendorEarning, 0);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{order.customerName}</div>
                        <div className="text-[10px] text-slate-400">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">{vendorItems.length} item(s)</span>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                          {vendorItems[0]?.productTitle}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ${storeSubtotal.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-600">
                        ${storeEarnings.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <OrderStatusBadge status={order.orderStatus} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/vendor/orders`}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-xs">
            No orders received for this store yet.
          </div>
        )}
      </div>
    </div>
  );
};
