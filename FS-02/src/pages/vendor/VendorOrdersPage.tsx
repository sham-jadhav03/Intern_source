import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { OrderStatusBadge } from '../../components/common/Badge';
import { OrderStatus } from '../../types';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Truck,
  MapPin,
  Clock,
  Check,
} from 'lucide-react';

export const VendorOrdersPage: React.FC = () => {
  const { selectedVendorId } = useAuthStore();
  const { orders, vendors, updateOrderStatus } = useMarketStore();

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [search, setSearch] = useState('');

  // Orders containing current vendor's items
  const vendorOrders = orders.filter((o) =>
    o.items.some((i) => i.vendorId === currentVendor.id)
  );

  const filteredOrders = vendorOrders.filter((order) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchCust = order.customerName.toLowerCase().includes(q);
      if (!matchNum && !matchCust) return false;
    }

    if (filterTab === 'pending') {
      return order.orderStatus === 'placed' || order.orderStatus === 'processing' || order.orderStatus === 'confirmed';
    }
    if (filterTab === 'shipped') {
      return order.orderStatus === 'shipped' || order.orderStatus === 'out_for_delivery';
    }
    if (filterTab === 'delivered') {
      return order.orderStatus === 'delivered';
    }
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus} by ${currentVendor.storeName}.`);
    toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Fulfillment Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process, dispatch, and track orders containing items from {currentVendor.storeName}
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Needs Action' },
            { id: 'shipped', label: 'In Transit' },
            { id: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
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
          {filteredOrders.map((order) => {
            const myItems = order.items.filter((i) => i.vendorId === currentVendor.id);
            const mySubtotal = myItems.reduce((acc, i) => acc + i.subtotal, 0);
            const myEarnings = myItems.reduce((acc, i) => acc + i.vendorEarning, 0);
            const myCommission = myItems.reduce((acc, i) => acc + i.platformCommission, 0);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Order Number
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {order.orderNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Order Date
                      </span>
                      <span className="text-slate-700 font-medium">
                        {order.createdAt.split('T')[0]}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Your Net Earnings
                      </span>
                      <span className="font-black text-emerald-600 text-sm">
                        ${myEarnings.toFixed(2)}
                      </span>
                    </div>

                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                </div>

                {/* Items & Fulfillment Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Items (7 cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Store Line Items ({myItems.length})
                    </span>
                    <div className="space-y-2">
                      {myItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.productImage}
                              alt={item.productTitle}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-800 line-clamp-1">
                                {item.productTitle}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-black text-slate-900">
                              ${item.subtotal.toFixed(2)}
                            </span>
                            <span className="block text-[10px] text-slate-400">
                              Fee: ${item.platformCommission.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Customer & Status Updater (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Customer & Delivery Info
                      </span>
                      <p className="font-bold text-slate-800">{order.customerName}</p>
                      <p className="text-slate-500">{order.customerEmail}</p>
                      <p className="text-slate-600 mt-1">
                        {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                        Update Fulfillment Status:
                      </label>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-xs text-slate-900 outline-none cursor-pointer focus:border-amber-400 shadow-xs"
                      >
                        <option value="placed">Placed (Order received)</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing (Packing in warehouse)</option>
                        <option value="shipped">Shipped (Handed to courier)</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No orders found</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no orders under the selected tab.
          </p>
        </div>
      )}
    </div>
  );
};
