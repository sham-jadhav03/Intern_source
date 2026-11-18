import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { RoleSwitcher } from '../../components/common/RoleSwitcher';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  DollarSign,
  Store,
  Star,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const VendorDashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { selectedVendorId, loginAs } = useAuthStore();
  const { vendors, orders } = useMarketStore();

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  // Vendor specific pending orders count
  const vendorOrders = orders.filter((o) =>
    o.items.some((i) => i.vendorId === currentVendor.id)
  );
  const pendingOrdersCount = vendorOrders.filter(
    (o) => o.orderStatus === 'placed' || o.orderStatus === 'processing'
  ).length;

  const navItems = [
    { name: 'Overview', path: '/vendor', icon: LayoutDashboard },
    { name: 'Products', path: '/vendor/products', icon: Package },
    {
      name: 'Orders',
      path: '/vendor/orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    { name: 'Inventory & Alerts', path: '/vendor/inventory', icon: Boxes },
    { name: 'Earnings & Payouts', path: '/vendor/earnings', icon: DollarSign },
    { name: 'Store Profile', path: '/vendor/profile', icon: Store },
    { name: 'Product Reviews', path: '/vendor/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              VP
            </div>
            <span className="font-bold text-sm tracking-tight">{currentVendor.storeName}</span>
          </div>
        </div>

        <RoleSwitcher />
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Brand & Store selector */}
          <div className="p-5 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-md">
                <Store className="w-4 h-4 text-slate-950" />
              </div>
              <div className="flex items-center">
                <span className="text-lg font-black text-white">Market</span>
                <span className="text-lg font-black text-brand-accent">Hub</span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded ml-2 uppercase">
                  Vendor
                </span>
              </div>
            </Link>

            {/* Active Store Card */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentVendor.logo}
                  alt={currentVendor.storeName}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-600 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">
                    {currentVendor.storeName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        currentVendor.status === 'approved' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span className="capitalize">{currentVendor.status}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">{currentVendor.rating}★</span>
                  </div>
                </div>
              </div>

              {/* Vendor Switcher dropdown */}
              <div className="mt-2.5 pt-2 border-t border-slate-700/50">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Select Store Demo:
                </label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => {
                    loginAs('vendor', undefined, e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white outline-none cursor-pointer focus:border-amber-400"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.storeName} ({v.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/vendor'
                  ? location.pathname === '/vendor'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Customer Storefront
          </Link>
          <div className="text-[10px] text-center text-slate-500 font-mono">
            Platform Commission: {currentVendor.commissionRate}%
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Topbar */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30 shadow-xs">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {currentVendor.storeName} — Vendor Command Center
            </h2>
            <p className="text-xs text-slate-500">
              Live inventory synchronization & marketplace order fulfillment
            </p>
          </div>

          <div className="flex items-center gap-4">
            <RoleSwitcher />

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-accent" />
              Storefront Preview
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {currentVendor.status !== 'approved' && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Account Status ({currentVendor.status.toUpperCase()}):</strong> Your vendor application is currently awaiting administrator verification. Switch role to <strong>Admin</strong> anytime to approve this vendor!
              </span>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
