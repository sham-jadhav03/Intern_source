import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { HeroBanner } from '../../components/customer/HeroBanner';
import { CategoryPills } from '../../components/customer/CategoryPills';
import { ProductCard } from '../../components/customer/ProductCard';
import {
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Store,
  Star,
  CheckCircle,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, vendors } = useMarketStore();

  // Simulated countdown for flash sale
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const trendingProducts = products.filter((p) => p.isTrending || p.isFeatured).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const specialOffers = products.filter((p) => p.discountPercentage && p.discountPercentage >= 15).slice(0, 4);
  const approvedVendors = vendors.filter((v) => v.status === 'approved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Category Pills Strip */}
      <CategoryPills />

      {/* Flash Deals / Special Offers with Timer */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/20 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-white text-orange-600 text-xs font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                Flash Deals
              </span>
              <span className="text-white/90 text-xs font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Deals Refresh Daily
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Up to 30% Off Daily Exclusives
            </h2>
            <p className="text-xs sm:text-sm text-white/90">
              Limited inventory available directly through verified brand partners.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-black/25 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 self-start md:self-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">Ends In:</span>
            <div className="flex items-center gap-1.5 font-mono text-base font-black">
              <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          {specialOffers.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl text-slate-900 shadow-md">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-accent flex items-center justify-center">
              <Flame className="w-6 h-6 fill-brand-accent" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Trending on MarketHub
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Most engaged and rapidly purchased items this week
              </p>
            </div>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-accent hover:text-brand-accentHover flex items-center gap-1 group"
          >
            <span>See All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Vendors Showcase */}
      <section className="bg-slate-100 rounded-3xl p-6 sm:p-10 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-accent uppercase tracking-wider mb-1">
              <Store className="w-4 h-4" /> Multi-Vendor Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Verified Stores
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect directly with verified independent makers, retailers, and boutique studios
            </p>
          </div>

          <Link
            to="/login"
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-primary text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Become a Vendor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvedVendors.slice(0, 4).map((vendor) => {
            const vendorProducts = products.filter((p) => p.vendorId === vendor.id);

            return (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={vendor.logo}
                      alt={vendor.storeName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {vendor.storeName}
                        </h4>
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{vendor.rating}</span>
                        <span className="text-slate-400 font-normal">
                          ({vendor.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {vendor.description}
                  </p>
                </div>

                <div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {vendorProducts.length} Products
                    </span>
                    <Link
                      to={`/products?vendor=${encodeURIComponent(vendor.id)}`}
                      className="text-brand-accent hover:text-brand-accentHover font-bold flex items-center gap-1"
                    >
                      Visit Store →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                All-Time Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Customer favorites backed by 5-star verified purchase reviews
              </p>
            </div>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-accent hover:text-brand-accentHover flex items-center gap-1 group"
          >
            <span>View Catalog</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotion banner coupon strip */}
      <section className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/70 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-accent text-white flex items-center justify-center shadow-md shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Shopper Welcome Gift: Enjoy 10% Off First Checkout
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Apply code <span className="font-mono font-bold text-brand-accent px-1.5 py-0.5 bg-white rounded border border-orange-200">WELCOME10</span> on any order over $50.00
            </p>
          </div>
        </div>

        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm shrink-0"
        >
          Redeem Offer
        </Link>
      </section>
    </div>
  );
};
