import React, { useState } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { Modal } from '../../components/common/Modal';
import { Coupon } from '../../types';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Calendar,
  Percent,
} from 'lucide-react';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponActive } = useMarketStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(50);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(100);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinOrderAmount(50);
    setMaxDiscount(100);
    setExpiryDate('2026-12-31');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDescription(c.description);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinOrderAmount(c.minOrderAmount);
    setMaxDiscount(c.maxDiscount);
    setExpiryDate(c.expiryDate);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Coupon code is required.');
      return;
    }

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        expiryDate,
      });
      toast.success(`Coupon ${code} updated successfully!`);
    } else {
      addCoupon({
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        expiryDate,
        isActive: true,
      });
      toast.success(`New coupon ${code} activated for shoppers!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, codeName: string) => {
    if (window.confirm(`Permanently delete coupon ${codeName}?`)) {
      deleteCoupon(id);
      toast.info(`Coupon ${codeName} deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Promotional Coupons & Discount Campaigns
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create shopper incentives, seasonal codes, and checkout order threshold promotions
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm flex flex-col justify-between ${
              c.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-black text-lg text-slate-900 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                  {c.code}
                </span>

                <button
                  onClick={() => {
                    toggleCouponActive(c.id);
                    toast.info(`Coupon ${c.code} ${c.isActive ? 'deactivated' : 'activated'}.`);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    c.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.isActive ? 'ACTIVE' : 'PAUSED'}
                </button>
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-1">{c.description}</h4>

              <div className="space-y-1.5 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Discount Value:</span>
                  <span className="font-bold text-slate-900">
                    {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `$${c.discountValue} Flat Off`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Min Order Spend:</span>
                  <span className="font-bold text-slate-800">${c.minOrderAmount.toFixed(2)}</span>
                </div>
                {c.maxDiscount && (
                  <div className="flex justify-between">
                    <span>Max Savings Cap:</span>
                    <span className="font-bold text-slate-800">${c.maxDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Redemptions:</span>
                  <span className="font-bold text-brand-accent">{c.usageCount} times</span>
                </div>
                <div className="flex justify-between">
                  <span>Expiry Date:</span>
                  <span className="font-mono text-slate-700">{c.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
              <button
                onClick={() => handleOpenEdit(c)}
                className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>

              <button
                onClick={() => handleDelete(c.id, c.code)}
                className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Promotional Coupon'}
        subtitle="Manage promotional discount codes for customer checkouts"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
              Coupon Code
            </label>
            <input
              type="text"
              placeholder="e.g. FLASH30, FESTIVE15"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
              Public Description
            </label>
            <input
              type="text"
              placeholder="e.g. 15% discount for shoppers across all departments"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Cash Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Discount Value
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Min Order Spend ($)
              </label>
              <input
                type="number"
                min="0"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              {editingCoupon ? 'Save Changes' : 'Activate Coupon'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
