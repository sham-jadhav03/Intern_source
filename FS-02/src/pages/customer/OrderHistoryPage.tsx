import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { useAuthStore } from '../../store/useAuthStore';
import { OrderStatusBadge } from '../../components/common/Badge';
import {
  Package,
  ChevronRight,
  Truck,
  Calendar,
  Store,
  ArrowRight,
} from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { orders } = useMarketStore();
  const { currentUser } = useAuthStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter orders by customer or show all if customer matches
  const customerOrders = orders.filter((o) => {
    if (currentUser?.email) {
      return o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() || o.customerId === currentUser.id;
    }
    return true;
  });

  const filteredOrders = customerOrders.filter((order) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'delivered') return order.orderStatus === 'delivered';
    if (filterStatus === 'cancelled') return order.orderStatus === 'cancelled';
    if (filterStatus === 'active') {
      return order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled';
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Orders & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View order updates, track shipments, and review past deliveries
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'In Progress' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-brand-primary">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Order Reference
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {order.orderNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Placed On
                    </span>
                    <span className="text-slate-700 font-medium">
                      {order.createdAt.split('T')[0]}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Total
                    </span>
                    <span className="font-black text-slate-900 text-sm">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  <OrderStatusBadge status={order.orderStatus} />
                </div>
              </div>

              {/* Items preview row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.productTitle}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sold by <span className="font-semibold text-slate-700">{item.vendorName}</span> • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer action row */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Truck className="w-4 h-4 text-brand-accent" />
                  <span>
                    {order.orderStatus === 'delivered' ? 'Delivered on' : 'Estimated arrival:'}{' '}
                    <strong className="text-slate-800">{order.estimatedDelivery}</strong>
                  </span>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <span>Track & View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No orders found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            There are no orders matching the selected filter status.
          </p>
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-primary text-white hover:bg-slate-800"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};
