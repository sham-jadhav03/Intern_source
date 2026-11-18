import React, { useState } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import {
  Settings,
  Save,
  RotateCcw,
  Sparkles,
  DollarSign,
  Truck,
  Percent,
  Bell,
  CheckCircle2,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useMarketStore();

  const [siteName, setSiteName] = useState(settings.siteName);
  const [defaultCommissionRate, setDefaultCommissionRate] = useState(
    settings.defaultCommissionRate
  );
  const [shippingFee, setShippingFee] = useState(settings.shippingFee);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    settings.freeShippingThreshold
  );
  const [taxRate, setTaxRate] = useState(settings.taxRate);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [bannerNotice, setBannerNotice] = useState(settings.bannerNotice);
  const [isBannerActive, setIsBannerActive] = useState(settings.isBannerActive);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteName,
      defaultCommissionRate: Number(defaultCommissionRate),
      shippingFee: Number(shippingFee),
      freeShippingThreshold: Number(freeShippingThreshold),
      taxRate: Number(taxRate),
      currencySymbol,
      bannerNotice,
      isBannerActive,
    });
    toast.success('Platform configurations saved & synchronized live!');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Warning: This will reset all orders, new products, and custom settings back to initial demo seeds. Proceed?'
      )
    ) {
      resetToDemoData();
      toast.success('MarketHub reset to fresh initial prototype seed state!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Platform Architecture & Operational Parameters
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Global marketplace commerce logic, checkout fees, shipping policies, and announcements
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Storefront Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-rose-600" />
            General Marketplace Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Platform Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Currency Symbol
              </label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Global Logistics & Commission Rates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Fee & Delivery Calculation Engine
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Default Commission Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={defaultCommissionRate}
                onChange={(e) => setDefaultCommissionRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Standard Shipping Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                min="0"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Marketplace Sales Tax (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Global Announcement Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-accent" />
              Customer Top Announcement Banner
            </h3>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={isBannerActive}
                onChange={(e) => setIsBannerActive(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
              Notice Message (Displayed across customer header)
            </label>
            <input
              type="text"
              value={bannerNotice}
              onChange={(e) => setBannerNotice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save All Configurations
          </button>
        </div>
      </form>

      {/* Danger Zone: Restore Demo Data */}
      <div className="rounded-3xl p-6 sm:p-8 border-2 border-dashed border-rose-200 bg-rose-50/50 space-y-4">
        <div>
          <h3 className="text-base font-bold text-rose-950">
            Prototype Evaluation Reset
          </h3>
          <p className="text-xs text-rose-700 mt-1">
            Instantly wipe any experimental edits and restore the full 30 products, 5 vendors, 15 orders, and 5 coupons seed database.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Clean Demo State
        </button>
      </div>
    </div>
  );
};
