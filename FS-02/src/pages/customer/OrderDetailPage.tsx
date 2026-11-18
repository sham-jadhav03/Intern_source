import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { OrderStatusBadge } from '../../components/common/Badge';
import { OrderStatus } from '../../types';
import {
  Package,
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  CreditCard,
  ChevronLeft,
  XCircle,
  Store,
  Star,
  ShieldCheck,
} from 'lucide-react';

const steps: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'placed', label: 'Placed', icon: <Clock className="w-4 h-4" /> },
  { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" /> },
  { key: 'processing', label: 'Processing', icon: <Package className="w-4 h-4" /> },
  { key: 'shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck className="w-4 h-4" /> },
  { key: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> },
];

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, cancelOrder } = useMarketStore();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/orders" className="text-xs text-brand-accent underline mt-2 block">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Determine current step index
  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex((s) => s.key === status);
  };

  const currentStepIdx = getStepIndex(order.orderStatus);

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(order.id, 'Cancelled by customer.');
      toast.success('Order has been cancelled.');
    }
  };

  const canCancel = order.orderStatus === 'placed' || order.orderStatus === 'confirmed';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <Link
            to="/orders"
            className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to My Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
          <p className="text-xs text-slate-500">
            Placed on {new Date(order.createdAt).toLocaleString()} • Estimated Arrival: {order.estimatedDelivery}
          </p>
        </div>

        {canCancel && (
          <button
            onClick={handleCancelOrder}
            className="px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <XCircle className="w-4 h-4" /> Cancel Order
          </button>
        )}
      </div>

      {/* Visual Tracking Stepper */}
      {order.orderStatus !== 'cancelled' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900">Live Shipment Progress</h3>

          <div className="relative">
            {/* Desktop progress bar */}
            <div className="hidden sm:grid grid-cols-6 relative z-10">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                        isCompleted
                          ? 'bg-brand-primary text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      } ${isCurrent ? 'ring-4 ring-orange-200 scale-110 !bg-brand-accent text-white' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <span
                      className={`text-xs mt-2 font-bold ${
                        isCompleted ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Connecting Bar (Desktop) */}
            <div className="hidden sm:block absolute top-5 left-[8%] right-[8%] h-1 bg-slate-200 -z-0">
              <div
                className="h-full bg-brand-primary transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="sm:hidden space-y-4">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isCompleted ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'
                      } ${isCurrent ? 'ring-2 ring-brand-accent !bg-brand-accent' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <span className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 flex items-center gap-4 text-rose-800">
          <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Order Cancelled</h4>
            <p className="text-xs text-rose-600 mt-0.5">
              This order was cancelled. Any authorized charges will be refunded to your original payment method.
            </p>
          </div>
        </div>
      )}

      {/* Status History Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
          Tracking Timeline Updates
        </h3>
        <div className="space-y-4">
          {order.statusHistory.map((step, index) => (
            <div key={index} className="flex items-start gap-4 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="uppercase text-[11px] tracking-wider text-brand-secondary">
                    {step.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {new Date(step.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-600 mt-1">{step.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Purchased Products ({order.items.length})
          </h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <Link
                      to={`/products/${item.productId}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-accent line-clamp-1"
                    >
                      {item.productTitle}
                    </Link>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Vendor: <span className="font-semibold text-slate-700">{item.vendorName}</span>
                    </p>
                    <p className="text-xs font-semibold text-slate-700 mt-1">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-slate-900">
                    ${item.subtotal.toFixed(2)}
                  </span>
                  {order.orderStatus === 'delivered' && (
                    <Link
                      to={`/products/${item.productId}`}
                      className="block text-[11px] font-bold text-brand-accent hover:underline mt-1"
                    >
                      Write Review ★
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info: Address & Payment */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivery Address
            </h4>
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-slate-400 font-mono pt-1">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Payment Summary
            </h4>
            <div className="flex justify-between text-slate-600">
              <span>Method</span>
              <span className="font-bold text-slate-900 uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Status</span>
              <span className="font-bold text-emerald-600 uppercase">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
