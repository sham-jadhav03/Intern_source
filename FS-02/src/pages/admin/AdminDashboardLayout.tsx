import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { RoleSwitcher } from '../../components/common/RoleSwitcher';
import {
  ShieldAlert,
  Users,
  Store,
  Package,
  ShoppingBag,
  Percent,
  Tag,
  MessageSquare,
  BarChart3,
  Settings,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';

export const AdminDashboardLayout: React.FC = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { vendors, orders, settings } = useMarketStore();

  const pendingVendorsCount = vendors.filter((v) => v.status === 'pending').length;

  const navItems = [
    { name: 'Executive Overview', path: '/admin', icon: Layers },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
    {
      name: 'Vendor Approvals',
      path: '/admin/vendors',
      icon: Store,
      badge: pendingVendorsCount > 0 ? `${pendingVendorsCount} Pending` : undefined,
    },
    { name: 'Product Catalog', path: '/admin/products', icon: Package },
    { name: 'Global Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Commissions & Fees', path: '/admin/commissions', icon: Percent },
    { name: 'Coupon Promotions', path: '/admin/coupons', icon: Tag },
    { name: 'Review Moderation', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Deep Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-950 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-black flex items-center justify-center text-xs">
              AD
            </div>
            <span className="font-bold text-sm tracking-tight">MarketHub Admin</span>
          </div>
        </div>

        <RoleSwitcher />
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col justify-between transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-900">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-900/40">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-xl font-black text-white">Market</span>
                  <span className="text-xl font-black text-brand-accent">Hub</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  Super Administrator
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Back to Public Storefront
          </Link>
          <div className="text-[10px] text-center text-slate-500 font-mono">
            Platform Default Fee: {settings.defaultCommissionRate}%
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Topbar */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30 shadow-xs">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              MarketHub Global Marketplace Administration
            </h2>
            <p className="text-xs text-slate-500">
              System health: <strong className="text-emerald-600">Optimal</strong> • Commission Rate: <strong className="text-brand-accent">{settings.defaultCommissionRate}%</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <RoleSwitcher />
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-accent" />
              Live Storefront
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
