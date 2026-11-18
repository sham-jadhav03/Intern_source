import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from '../../store/useToastStore';
import { Address } from '../../types';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Store,
  MapPin,
  Plus,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, addAddress } = useAuthStore();
  const {
    cart,
    createOrder,
    getCartSubtotal,
    getCartDiscount,
    getCartShippingFee,
    getCartTotal,
    appliedCoupon,
  } = useMarketStore();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address state
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  // Card payment mock state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/27');
  const [cardCvv, setCardCvv] = useState('921');
  const [upiId, setUpiId] = useState('sarah@okaxis');

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const shippingFee = getCartShippingFee();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is currently empty</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const savedAddresses = currentUser?.savedAddresses || [
    {
      fullName: currentUser?.name || 'Sarah Jenkins',
      phone: currentUser?.phone || '+1 (555) 123-4567',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States',
      isDefault: true,
    },
  ];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.postalCode) {
      toast.error('Please complete all required address fields.');
      return;
    }
    addAddress(newAddress);
    setShowNewAddressForm(false);
    setSelectedAddressIndex(savedAddresses.length);
    toast.success('New address added to your address book!');
  };

  const handlePlaceOrder = () => {
    const activeAddress = savedAddresses[selectedAddressIndex] || savedAddresses[0];
    if (!activeAddress) {
      toast.error('Please select or add a shipping address.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        customerId: currentUser?.id || 'cust-1',
        customerName: activeAddress.fullName,
        customerEmail: currentUser?.email || 'customer@markethub.com',
        customerPhone: activeAddress.phone,
        shippingAddress: activeAddress,
        paymentMethod: paymentMethod,
      });

      setIsProcessing(false);
      toast.success(`Order #${order.orderNumber} placed successfully!`);
      navigate(`/order-confirmation/${order.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Secure Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            256-bit SSL Simulated End-to-End Encryption
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Address & Payment (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Shipping Address */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Select Delivery Address
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="text-xs font-bold text-brand-accent hover:text-brand-accentHover flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {showNewAddressForm ? 'Cancel' : 'Add New Address'}
              </button>
            </div>

            {/* Saved Addresses Selector */}
            {!showNewAddressForm ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr, idx) => {
                  const isSelected = selectedAddressIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-brand-accent bg-orange-50/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                          <span className="text-xs font-bold text-slate-900">
                            {addr.fullName}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 font-mono">
                        Phone: {addr.phone}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Add New Address Form */
              <form onSubmit={handleAddNewAddress} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                      Recipient Full Name
                    </label>
                    <input
                      type="text"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:border-brand-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:border-brand-accent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                    Street Address & Apartment
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:border-brand-accent"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                      City
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:border-brand-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                      State
                    </label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:border-brand-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:border-brand-accent"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-brand-primary text-white rounded-xl hover:bg-slate-800"
                  >
                    Save & Use Address
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Step 2: Payment Method */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Payment Method Selection
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'card'
                    ? 'border-brand-accent bg-orange-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <CreditCard className="w-5 h-5 text-brand-accent" />
                  {paymentMethod === 'card' && (
                    <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Credit / Debit Card</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Simulated Online Gateway</div>
                </div>
              </button>

              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'upi'
                    ? 'border-brand-accent bg-orange-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <QrCode className="w-5 h-5 text-brand-accent" />
                  {paymentMethod === 'upi' && (
                    <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">UPI / QR Instant</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Google Pay, PhonePe, UPI</div>
                </div>
              </button>

              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-brand-accent bg-orange-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <Banknote className="w-5 h-5 text-brand-accent" />
                  {paymentMethod === 'cod' && (
                    <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Cash on Delivery</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pay at doorstep upon arrival</div>
                </div>
              </button>
            </div>

            {/* Payment Fields (Card simulation) */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span className="font-semibold">Simulated Card Details (Pre-filled)</span>
                  <span className="text-emerald-600 font-bold">Ready to process</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI ID */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase">
                  Virtual Payment Address (VPA) / UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-accent"
                />
                <p className="text-[10px] text-slate-400">
                  A payment notification request will be approved in simulation mode.
                </p>
              </div>
            )}

            {/* COD Notice */}
            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-3">
                <Banknote className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Please keep exact change ready upon delivery. Our logistics agent will collect ${total.toFixed(2)} at your door.
                </span>
              </div>
            )}
          </section>
        </div>

        {/* Right: Order Items & Place Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Review ({cart.length} Items)
          </h3>

          {/* Items mini list */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cart.map((item) => {
              const price = item.product.discountPrice ?? item.product.price;
              return (
                <div key={item.productId} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.product.title}</p>
                    <p className="text-[10px] text-slate-400">
                      Qty: {item.quantity} × ${price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-black text-slate-900 shrink-0">
                    ${(price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
                ) : (
                  `$${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-accent hover:bg-brand-accentHover text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-wait"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Simulating Payment & Creating Order...</span>
              </div>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400">
            By clicking place order, you agree to MarketHub's Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};
