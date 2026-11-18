import React, { useState } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { OrderStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Store,
  DollarSign,
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useMarketStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!o.orderNumber.toLowerCase().includes(q) && !o.customerName.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    return true;
  });

  const handleAdminStatusOverride = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, `Administrator override status to ${newStatus}.`);
    toast.success(`Order #${selectedOrder?.orderNumber} status forced to ${newStatus.toUpperCase()}`);
    // Update local modal state
    if (selectedOrder) {
      setSelectedOrder({
        ...selectedOrder,
        orderStatus: newStatus,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Global Marketplace Order Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit, track, and override customer transactions across all independent vendors ({orders.length} Orders)
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'placed', label: 'Placed' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'In Transit' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by order reference number (e.g. MH-89211) or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-900 outline-none"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Date Placed</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Line Items</th>
                <th className="py-3.5 px-4">Order Total</th>
                <th className="py-3.5 px-4">Platform Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Inspect & Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((order) => {
                const totalCommission = order.items.reduce(
                  (sum, i) => sum + i.platformCommission,
                  0
                );

                return (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {order.createdAt.split('T')[0]}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{order.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {order.items.length} item(s)
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">
                      +${totalCommission.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={order.orderStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber} Breakdown`}
          subtitle={`Placed by ${selectedOrder.customerName} on ${new Date(selectedOrder.createdAt).toLocaleString()}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Status Override Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Super Admin Status Override
                </span>
                <OrderStatusBadge status={selectedOrder.orderStatus} />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) =>
                    handleAdminStatusOverride(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold outline-none cursor-pointer focus:border-rose-400"
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{item.productTitle}</p>
                        <p className="text-[11px] text-slate-500">
                          Vendor: <strong>{item.vendorName}</strong> • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">${item.subtotal.toFixed(2)}</span>
                      <span className="block text-[10px] text-emerald-600 font-bold">
                        Commission: +${item.platformCommission.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-bold text-slate-800">${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount ({selectedOrder.couponCode}):</span>
                  <span>-${selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping:</span>
                <span>${selectedOrder.shippingFee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Total Value:</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block mb-1">Shipping Destination:</span>
              <p>
                {selectedOrder.shippingAddress.fullName} — {selectedOrder.shippingAddress.street},{' '}
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                {selectedOrder.shippingAddress.postalCode}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
