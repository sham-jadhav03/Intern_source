import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Store,
  Calendar,
  CreditCard,
  MapPin,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useMarketStore();

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/" className="text-xs text-brand-accent underline mt-2 block">
          Return to Marketplace Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Successfully Placed
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Thank you for your purchase!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          We have notified the respective vendors. You will receive real-time shipping notifications as your packages are dispatched.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Order Reference</span>
            <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
          </div>

          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Est. Delivery</span>
            <span className="font-bold text-slate-900">{order.estimatedDelivery}</span>
          </div>

          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Payment Status</span>
            <span className="font-bold text-emerald-600 uppercase">
              {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
            </span>
          </div>
        </div>
      </div>

      {/* Order Items & Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Package className="w-4 h-4 text-brand-accent" />
          Ordered Items ({order.items.length})
        </h3>

        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50/70 border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.productImage}
                  alt={item.productTitle}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {item.productTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Store className="w-3 h-3 text-slate-400" />
                      {item.vendorName}
                    </span>
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  ${item.subtotal.toFixed(2)}
                </span>
                <span className="block text-[10px] text-slate-400">
                  (${item.price.toFixed(2)} each)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown summary */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-800">${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount ({order.couponCode})</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
            <span>Total Paid</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="pt-4 border-t border-slate-100 flex items-start gap-3 text-xs text-slate-600">
          <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">Delivering To:</span>
            <span>
              {order.shippingAddress.fullName} — {order.shippingAddress.street},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to={`/orders/${order.id}`}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-brand-primary text-white hover:bg-slate-800 flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Truck className="w-4 h-4" />
          <span>Track Live Status & Progress</span>
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
