import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { RatingStars } from '../../components/common/RatingStars';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Filter,
  Calendar,
  Package,
} from 'lucide-react';

export const VendorReviewsPage: React.FC = () => {
  const { selectedVendorId } = useAuthStore();
  const { reviews, vendors } = useMarketStore();

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  const [selectedStar, setSelectedStar] = useState<number | 'all'>('all');

  const vendorReviews = reviews.filter((r) => r.vendorId === currentVendor.id);

  const filtered = vendorReviews.filter((r) => {
    if (selectedStar !== 'all' && r.rating !== selectedStar) return false;
    return true;
  });

  const avgRating =
    vendorReviews.length > 0
      ? (
          vendorReviews.reduce((acc, r) => acc + r.rating, 0) / vendorReviews.length
        ).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Feedback & Product Ratings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reviews posted by verified shoppers on {currentVendor.storeName} catalog
          </p>
        </div>

        {/* Rating filter pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
          <button
            onClick={() => setSelectedStar('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedStar === 'all'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All ({vendorReviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStar(s)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStar === s
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {s}★
            </button>
          ))}
        </div>
      </div>

      {/* Rating Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-8">
        <div className="text-center sm:text-left space-y-1 sm:border-r border-slate-200 sm:pr-8">
          <span className="text-4xl font-black text-slate-900">{avgRating}</span>
          <div>
            <RatingStars rating={Number(avgRating)} size="md" />
          </div>
          <span className="text-xs text-slate-400 block mt-1">
            Overall Store Reputation ({vendorReviews.length} Ratings)
          </span>
        </div>

        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = vendorReviews.filter((r) => r.rating === star).length;
            const pct = vendorReviews.length > 0 ? (count / vendorReviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-slate-600 font-semibold">{star} Stars</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      rev.customerAvatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={rev.customerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                  </div>
                </div>

                <RatingStars rating={rev.rating} size="sm" />
              </div>

              <div className="text-xs font-bold text-brand-secondary flex items-center gap-1.5 pt-1">
                <Package className="w-3.5 h-3.5" />
                <span>Product: {rev.productTitle}</span>
              </div>

              {rev.title && (
                <h4 className="text-sm font-bold text-slate-900">{rev.title}</h4>
              )}

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-6 text-slate-400 text-xs">
          No customer reviews matching this rating tier.
        </div>
      )}
    </div>
  );
};
