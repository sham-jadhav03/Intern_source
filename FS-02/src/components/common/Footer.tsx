import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CreditCard,
  Mail,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Service Highlights Strip */}
      <div className="border-b border-slate-800 py-10 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary border border-slate-700 flex items-center justify-center text-brand-accent shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free & Fast Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">Complimentary delivery on orders &gt; $100</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary border border-slate-700 flex items-center justify-center text-brand-accent shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Authentic Vendors</h4>
                <p className="text-xs text-slate-400 mt-0.5">Vetted quality guaranteed directly by brands</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary border border-slate-700 flex items-center justify-center text-brand-accent shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">30-Day Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Instant refunds & simple pickup process</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary border border-slate-700 flex items-center justify-center text-brand-accent shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Priority Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Dedicated concierge desk for all buyers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                <Store className="w-5 h-5 text-brand-accent" />
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-black text-white tracking-tight">Market</span>
                <span className="text-2xl font-black text-brand-accent tracking-tight">Hub</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              MarketHub is a next-generation multi-vendor commerce ecosystem empowering independent creators, premium brands, and modern consumers with seamless global retail.
            </p>
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-300 mb-2">Subscribe for exclusive drops</div>
              <div className="flex max-w-sm rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() => alert('Subscribed to MarketHub newsletter!')}
                  className="bg-brand-accent hover:bg-brand-accentHover text-white px-4 text-xs font-bold transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Customer Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Your Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Account Settings
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Explore Catalog
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => alert('Shipping policy: standard 3-5 business days.')}>
                  Shipping Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Vendors & Partners
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/vendor" className="text-amber-400 hover:text-amber-300 font-medium">
                  Vendor Portal Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sell on MarketHub
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => alert('Platform commission is 10% on settled transactions.')}>
                  Commission Rates (10%)
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => alert('Payouts are processed twice weekly via direct bank transfer.')}>
                  Payout Guidelines
                </span>
              </li>
              <li>
                <Link to="/admin" className="text-rose-400 hover:text-rose-300 font-medium">
                  Admin Platform Control
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Security & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors" onClick={() => alert('Buyer Protection: 100% money back guarantee on non-deliveries.')}>
                  Buyer Protection
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors" onClick={() => alert('Privacy policy is encrypted and GDPR compliant.')}>
                  Privacy & Cookies
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors" onClick={() => alert('Terms of Service: prototype mode for educational evaluation.')}>
                  Terms of Service
                </span>
              </li>
              <li className="pt-2 flex items-center gap-2 text-slate-400">
                <CreditCard className="w-4 h-4 text-brand-accent" />
                <span>Simulated Secure Checkout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MarketHub Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Full-Stack E-Commerce Specialization (FS-01).
          </p>
        </div>
      </div>
    </footer>
  );
};
