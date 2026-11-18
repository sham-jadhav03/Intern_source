import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { RoleSwitcher } from './RoleSwitcher';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Package,
  Layers,
  Sparkles,
  Store,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { currentUser, role, logout } = useAuthStore();
  const { cart, wishlist, categories, settings } = useMarketStore();
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
    navigate(`/products?${params.toString()}`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner Notice */}
      {settings.isBannerActive && settings.bannerNotice && (
        <div className="bg-brand-primary text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>{settings.bannerNotice}</span>
          <span className="hidden sm:inline-block bg-brand-accent text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
            Limited Time
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Store className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl font-black text-brand-primary tracking-tight">Market</span>
                  <span className="text-xl sm:text-2xl font-black text-brand-accent tracking-tight">Hub</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 -mt-1 hidden sm:block">
                  Multi-Vendor Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center relative"
          >
            <div className="flex w-full rounded-xl border-2 border-slate-200 hover:border-brand-accent focus-within:border-brand-accent bg-slate-50 transition-colors overflow-hidden shadow-inner">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-100 text-xs font-semibold text-slate-700 px-3 py-2.5 border-r border-slate-200 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search products, brands, tech gadgets, fashion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none"
              />

              <button
                type="submit"
                className="bg-brand-accent hover:bg-brand-accentHover text-white px-5 flex items-center justify-center transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Demo Role Switcher */}
            <RoleSwitcher />

            {/* Quick Link to Vendor or Admin Dashboard if logged in as that role */}
            {role === 'vendor' && (
              <Link
                to="/vendor"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors"
              >
                <Store className="w-4 h-4" />
                Vendor Panel
              </Link>
            )}

            {role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-700 hover:text-brand-accent hover:bg-slate-100 rounded-xl transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-brand-accent hover:bg-slate-100 rounded-xl transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Menu */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-300"
                    />
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize">{role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {profileDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-2xl border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <Package className="w-4 h-4 text-slate-400" />
                            My Orders & Tracking
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <Heart className="w-4 h-4 text-slate-400" />
                            My Wishlist ({wishlistCount})
                          </Link>
                          {role === 'vendor' && (
                            <Link
                              to="/vendor"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 font-semibold"
                            >
                              <Store className="w-4 h-4 text-amber-600" />
                              Go to Vendor Dashboard
                            </Link>
                          )}
                          {role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold"
                            >
                              <ShieldCheck className="w-4 h-4 text-rose-600" />
                              Go to Admin Control
                            </Link>
                          )}
                        </div>

                        <div className="pt-1 border-t border-slate-100">
                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdownOpen(false);
                            }}
                            className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation Row: Quick Category Strip */}
        <div className="hidden lg:flex items-center justify-between py-2.5 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-6 font-medium text-slate-600">
            <Link
              to="/products"
              className="flex items-center gap-1.5 text-slate-900 font-bold hover:text-brand-accent transition-colors"
            >
              <Layers className="w-4 h-4 text-brand-accent" />
              All Products
            </Link>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="hover:text-brand-accent transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 100% Verified Vendors
            </span>
            <span>Free Shipping on Orders &gt; $100</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-l-xl px-4 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-brand-accent text-white px-4 rounded-r-xl"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-1 font-medium text-sm text-slate-700">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-50 font-bold text-slate-900"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 rounded-lg hover:bg-slate-50 text-slate-600"
              >
                {cat.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-50 font-medium"
              >
                My Orders & Tracking
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-50 font-medium"
              >
                Wishlist ({wishlistCount})
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-slate-50 font-medium"
              >
                Customer Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
