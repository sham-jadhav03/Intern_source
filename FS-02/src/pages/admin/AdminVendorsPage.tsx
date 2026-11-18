import React, { useState } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { VendorStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Vendor } from '../../types';
import {
  Store,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Percent,
  Search,
  Eye,
  Star,
  ExternalLink,
} from 'lucide-react';

export const AdminVendorsPage: React.FC = () => {
  const { vendors, products, updateVendorStatus, updateVendorCommission } = useMarketStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Commission modal
  const [editingCommissionVendor, setEditingCommissionVendor] = useState<Vendor | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(10);

  const filtered = vendors.filter((v) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!v.storeName.toLowerCase().includes(q) && !v.name.toLowerCase().includes(q)) return false;
    }
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  const handleApprove = (v: Vendor) => {
    updateVendorStatus(v.id, 'approved');
    toast.success(`Merchant "${v.storeName}" has been approved!`);
  };

  const handleReject = (v: Vendor) => {
    updateVendorStatus(v.id, 'rejected');
    toast.error(`Merchant "${v.storeName}" application was rejected.`);
  };

  const handleSuspend = (v: Vendor) => {
    if (window.confirm(`Suspend store "${v.storeName}"? Customer listings will be paused.`)) {
      updateVendorStatus(v.id, 'suspended');
      toast.warning(`Store "${v.storeName}" has been suspended.`);
    }
  };

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommissionVendor) return;
    updateVendorCommission(editingCommissionVendor.id, newCommissionRate);
    toast.success(`Commission rate for ${editingCommissionVendor.storeName} updated to ${newCommissionRate}%!`);
    setEditingCommissionVendor(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Vendor Directory & Approval Gate
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorize seller applications, suspend offending stores, and adjust commission rates
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
          {[
            { id: 'all', label: 'All Merchants' },
            { id: 'pending', label: 'Pending Approvals' },
            { id: 'approved', label: 'Active Stores' },
            { id: 'suspended', label: 'Suspended' },
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

      {/* Vendors Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Store & Merchant</th>
                <th className="py-3.5 px-4">Catalog Size</th>
                <th className="py-3.5 px-4">Reputation</th>
                <th className="py-3.5 px-4">Commission Rate</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((vendor) => {
                const prodCount = products.filter((p) => p.vendorId === vendor.id).length;

                return (
                  <tr key={vendor.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vendor.logo}
                          alt={vendor.storeName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{vendor.storeName}</p>
                          <p className="text-[11px] text-slate-500">
                            Owner: {vendor.name} ({vendor.email})
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Joined: {vendor.joinedDate}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {prodCount} Products
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{vendor.rating}</span>
                        <span className="text-slate-400 font-normal">({vendor.reviewCount})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          setEditingCommissionVendor(vendor);
                          setNewCommissionRate(vendor.commissionRate);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-brand-accent hover:bg-orange-100 font-bold border border-orange-200 transition-colors"
                        title="Click to adjust commission percentage"
                      >
                        <Percent className="w-3 h-3" />
                        <span>{vendor.commissionRate}% Fee</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <VendorStatusBadge status={vendor.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {vendor.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(vendor)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}

                        {vendor.status === 'pending' && (
                          <button
                            onClick={() => handleReject(vendor)}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        )}

                        {vendor.status === 'approved' && (
                          <button
                            onClick={() => handleSuspend(vendor)}
                            className="px-3 py-1.5 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" /> Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Modal */}
      {editingCommissionVendor && (
        <Modal
          isOpen={!!editingCommissionVendor}
          onClose={() => setEditingCommissionVendor(null)}
          title={`Configure Commission for ${editingCommissionVendor.storeName}`}
          subtitle="Customize platform take rate for this specific merchant"
        >
          <form onSubmit={handleSaveCommission} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                Platform Take Percentage (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={newCommissionRate}
                  onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-base font-bold text-slate-900 outline-none focus:border-rose-500"
                  required
                />
                <span className="text-xl font-bold text-slate-600">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Every order fulfilled by {editingCommissionVendor.storeName} will contribute this fee to platform gross revenues.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCommissionVendor(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Update Rate
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
