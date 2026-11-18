import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { UserRole } from '../../types';
import {
  Users,
  Store,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs, selectedVendorId } = useAuthStore();
  const { vendors } = useMarketStore();

  const [activeTab, setActiveTab] = useState<UserRole>('customer');
  const [email, setEmail] = useState('customer@markethub.com');
  const [password, setPassword] = useState('••••••••');
  const [vendorChoice, setVendorChoice] = useState('ven-1');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (role: UserRole) => {
    setActiveTab(role);
    if (role === 'customer') {
      setEmail('customer@markethub.com');
      setPassword('customer123');
    } else if (role === 'vendor') {
      setEmail('vendor@markethub.com');
      setPassword('vendor123');
    } else if (role === 'admin') {
      setEmail('admin@markethub.com');
      setPassword('admin123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      loginAs(activeTab, email, activeTab === 'vendor' ? vendorChoice : undefined);
      setIsLoading(false);
      toast.success(`Welcome to MarketHub as ${activeTab.toUpperCase()}!`);

      if (activeTab === 'customer') {
        navigate('/');
      } else if (activeTab === 'vendor') {
        navigate('/vendor');
      } else if (activeTab === 'admin') {
        navigate('/admin');
      }
    }, 600);
  };

  const handleQuickDemoCard = (role: UserRole, customVendor?: string) => {
    loginAs(role, undefined, customVendor);
    toast.success(`Quick Access: Logged in as ${role.toUpperCase()}!`);
    if (role === 'customer') navigate('/');
    if (role === 'vendor') navigate('/vendor');
    if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Store className="w-7 h-7 text-brand-accent" />
            </div>
            <div className="flex items-center text-3xl font-black">
              <span className="text-brand-primary">Market</span>
              <span className="text-brand-accent">Hub</span>
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Role-Based Demo Authentication
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Choose any of the 3 persona portals below to immediately test customer browsing, vendor store management, or administrator moderation.
          </p>
        </div>

        {/* 1-Click Role Quick Jump Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer Portal */}
          <div
            onClick={() => handleQuickDemoCard('customer')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg ${
              activeTab === 'customer'
                ? 'border-brand-primary bg-white shadow-md'
                : 'border-slate-200 bg-white/70 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Shopper
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Customer Persona</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Browse catalog, manage cart & wishlist, simulate checkout, track live shipment, and post verified ratings.
              </p>
              <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600">
                customer@markethub.com
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Launch Customer View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vendor Portal */}
          <div
            onClick={() => handleQuickDemoCard('vendor', 'ven-1')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg ${
              activeTab === 'vendor'
                ? 'border-amber-500 bg-white shadow-md'
                : 'border-slate-200 bg-white/70 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Merchant
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Vendor Persona</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Add & edit products, monitor low-stock warnings, dispatch incoming customer orders, and view net earnings.
              </p>
              <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600">
                vendor@markethub.com
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Launch Vendor Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Admin Portal */}
          <div
            onClick={() => handleQuickDemoCard('admin')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg ${
              activeTab === 'admin'
                ? 'border-rose-600 bg-white shadow-md'
                : 'border-slate-200 bg-white/70 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Platform
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Admin Persona</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Approve merchant applications, manage 10% platform commission rates, issue coupons, and review moderation.
              </p>
              <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600">
                admin@markethub.com
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Launch Admin Panel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Traditional Form / Custom Role Selector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-lg mx-auto space-y-6">
          <div className="flex border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interactive Sign-In Form (Simulated Credentials)
            </h4>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => handleSelectRole('customer')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'customer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleSelectRole('vendor')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'vendor'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Vendor
            </button>
            <button
              type="button"
              onClick={() => handleSelectRole('admin')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Demo Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-brand-accent font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Simulated Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-brand-accent font-mono"
                  required
                />
              </div>
            </div>

            {/* If vendor role, choose vendor store */}
            {activeTab === 'vendor' && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                  Target Vendor Storefront
                </label>
                <select
                  value={vendorChoice}
                  onChange={(e) => setVendorChoice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-amber-400 cursor-pointer"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.storeName} ({v.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand-primary hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In as {activeTab.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
