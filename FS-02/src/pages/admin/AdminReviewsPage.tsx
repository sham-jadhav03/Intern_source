import React, { useState } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { RatingStars } from '../../components/common/RatingStars';
import {
  MessageSquare,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Package,
  Flag,
} from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, deleteReview, updateReviewStatus } = useMarketStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = reviews.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !r.productTitle.toLowerCase().includes(q) &&
        !r.customerName.toLowerCase().includes(q) &&
        !r.comment.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this customer review permanently?')) {
      deleteReview(id);
      toast.info('Review removed.');
    }
  };

  const handleToggleFlag = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'flagged' ? 'approved' : 'flagged';
    updateReviewStatus(id, newStatus as any);
    toast.success(`Review status changed to ${newStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Review Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit user testimonials, uphold marketplace credibility, and remove flagged remarks ({reviews.length} Total)
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'approved', label: 'Approved' },
            { id: 'flagged', label: 'Flagged for Review' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === tab.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by product name, reviewer name, or review content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-900 outline-none"
        />
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm space-y-3 ${
              r.status === 'flagged' ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={
                    r.customerAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                  }
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{r.customerName}</span>
                    {r.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{r.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <RatingStars rating={r.rating} size="sm" />
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    r.status === 'flagged'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-brand-secondary font-bold">
              <Package className="w-3.5 h-3.5" />
              <span>Target Product: {r.productTitle}</span>
            </div>

            {r.title && <h4 className="text-sm font-bold text-slate-900">{r.title}</h4>}

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              "{r.comment}"
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => handleToggleFlag(r.id, r.status)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-colors ${
                  r.status === 'flagged'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {r.status === 'flagged' ? 'Mark Approved' : 'Flag Remarks'}
              </button>

              <button
                onClick={() => handleDelete(r.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
