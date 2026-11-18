import React, { useState } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { Modal } from '../../components/common/Modal';
import { Vendor } from '../../types';
import {
  Percent,
  DollarSign,
  TrendingUp,
  Store,
  Edit2,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const AdminCommissionsPage: React.FC = () => {
  const { vendors, orders, settings, updateSettings, updateVendorCommission } = useMarketStore();

  const [globalRate, setGlobalRate] = useState<number>(settings.defaultCommissionRate);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [customRate, setCustomRate] = useState<number>(10);

  // Compute total financials
  let totalGMV = 0;
  let totalPlatformCommission = 0;

  orders.forEach((o) => {
    if (o.orderStatus !== 'cancelled') {
      totalGMV += o.total;
      o.items.forEach((i) => {
        totalPlatformCommission += i.platformCommission;
      });
    }
  });

  const handleSaveGlobalRate = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ defaultCommissionRate: Number(globalRate) });
    toast.success(`Default platform commission set to ${globalRate}% for all new orders!`);
  };

  const handleSaveVendorCustomRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;
    updateVendorCommission(editingVendor.id, Number(customRate));
    toast.success(`Commission rate for ${editingVendor.storeName} set to ${customRate}%!`);
    setEditingVendor(null);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Platform Commission & Fee Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure marketplace revenue splits, manage merchant contracts, and audit fee revenue
        </p>
      </div>

      {/* Global Config Card & Revenue Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Global Commission Setting Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-accent flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Default Global Rate</h3>
              <p className="text-xs text-slate-500">Applied automatically to newly authorized vendors</p>
            </div>
          </div>

          <form onSubmit={handleSaveGlobalRate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                Standard Platform Cut (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="0.5"
                  value={globalRate}
                  onChange={(e) => setGlobalRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-base font-bold text-slate-900 outline-none focus:border-brand-accent"
                  required
                />
                <span className="text-xl font-bold text-slate-600">%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              When a shopper completes checkout, {globalRate}% of line item revenue is collected into platform revenue.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" /> Save Default Platform Rate
            </button>
          </form>
        </div>

        {/* Aggregate Revenue Totals */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Platform Commission
              </span>
              <div className="text-3xl font-black text-emerald-600">
                ${totalPlatformCommission.toFixed(2)}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Realized profit retained across all active vendor orders
            </p>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Total Gross Merchandise Value (GMV)
              </span>
              <div className="text-3xl font-black text-white">${totalGMV.toFixed(2)}</div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Effective Average Take Rate: <strong className="text-white">{(totalGMV > 0 ? (totalPlatformCommission / totalGMV) * 100 : 10).toFixed(1)}%</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Vendor Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
          Store-by-Store Commission Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Merchant Store</th>
                <th className="py-3 px-4">Contract Rate</th>
                <th className="py-3 px-4">Gross Store Sales</th>
                <th className="py-3 px-4">Platform Fee Collected</th>
                <th className="py-3 px-4">Net Merchant Disbursal</th>
                <th className="py-3 px-4 text-right">Customize</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {vendors.map((vendor) => {
                let vendorSales = 0;
                let vendorCommission = 0;
                let vendorNet = 0;

                orders.forEach((o) => {
                  if (o.orderStatus !== 'cancelled') {
                    o.items.forEach((item) => {
                      if (item.vendorId === vendor.id) {
                        vendorSales += item.subtotal;
                        vendorCommission += item.platformCommission;
                        vendorNet += item.vendorEarning;
                      }
                    });
                  }
                });

                return (
                  <tr key={vendor.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vendor.logo}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{vendor.storeName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {vendor.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-accent bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                        {vendor.commissionRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${vendorSales.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">
                      +${vendorCommission.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      ${vendorNet.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingVendor(vendor);
                          setCustomRate(vendor.commissionRate);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 ml-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Vendor Commission Modal */}
      {editingVendor && (
        <Modal
          isOpen={!!editingVendor}
          onClose={() => setEditingVendor(null)}
          title={`Override Commission for ${editingVendor.storeName}`}
          subtitle="Contract amendment for specific vendor tier"
        >
          <form onSubmit={handleSaveVendorCustomRate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                Custom Take Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={customRate}
                onChange={(e) => setCustomRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-base font-bold text-slate-900 outline-none focus:border-brand-accent"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingVendor(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl shadow-md"
              >
                Save Contract Rate
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
