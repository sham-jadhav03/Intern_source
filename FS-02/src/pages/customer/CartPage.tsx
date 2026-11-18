import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Store,
  X,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    getCartSubtotal,
    getCartDiscount,
    getCartShippingFee,
    getCartTotal,
    coupons,
    settings,
  } = useMarketStore();

  const [couponInput, setCouponInput] = useState('');

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const shippingFee = getCartShippingFee();
  const total = getCartTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      toast.success(res.message);
      setCouponInput('');
    } else {
      toast.error(res.message);
    }
  };

  const handleQuickCoupon = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto mt-2 mb-8">
          Looks like you haven't added anything to your cart yet. Explore our curated collections from verified vendors!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-brand-primary text-white hover:bg-slate-800 transition-colors shadow-md"
        >
          <span>Start Shopping Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            You have <span className="font-bold text-slate-900">{cart.length}</span> unique item(s) in your basket
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear your cart?')) {
              clearCart();
              toast.info('Cart cleared.');
            }
          }}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const price = item.product.discountPrice ?? item.product.price;
            const itemTotal = price * item.quantity;

            return (
              <div
                key={item.productId}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Store className="w-3 h-3 text-slate-400" />
                      <span>{item.product.vendorName}</span>
                    </div>

                    <Link
                      to={`/products/${item.product.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-brand-accent line-clamp-1"
                    >
                      {item.product.title}
                    </Link>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">
                        ${price.toFixed(2)}
                      </span>
                      {item.product.discountPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ${item.product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stepper & Subtotal */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-2 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">
                      ${itemTotal.toFixed(2)}
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.productId);
                        toast.info('Item removed from cart.');
                      }}
                      className="text-[11px] font-medium text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-800 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              Orders placed on MarketHub are covered by our 100% money-back guarantee and verified vendor warranty.
            </span>
          </div>
        </div>

        {/* Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          {/* Pricing breakdown */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Coupon Discount ({appliedCoupon?.code})
                </span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Shipping & Delivery Fee</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase text-[11px]">Free</span>
                ) : (
                  <span className="font-bold text-slate-900">${shippingFee.toFixed(2)}</span>
                )}
              </span>
            </div>

            {shippingFee > 0 && (
              <p className="text-[11px] text-slate-400">
                Add ${(settings.freeShippingThreshold - subtotal).toFixed(2)} more to qualify for FREE shipping!
              </p>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total Amount</span>
              <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Apply Promo / Coupon Code
            </label>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    <strong className="font-bold">{appliedCoupon.code}</strong> applied ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% off` : `$${appliedCoupon.discountValue} off`})
                  </span>
                </div>
                <button
                  onClick={() => {
                    removeCoupon();
                    toast.info('Coupon removed.');
                  }}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider outline-none focus:border-brand-accent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Quick demo coupon suggestions */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5">
                Quick Demo Coupons (Click to apply):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {coupons.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleQuickCoupon(c.code)}
                    className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-slate-100 hover:bg-orange-100 hover:text-brand-accent text-slate-600 border border-slate-200 transition-colors"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-accent hover:bg-brand-accentHover text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
