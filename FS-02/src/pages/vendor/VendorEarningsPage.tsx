import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { Modal } from '../../components/common/Modal';
import {
  DollarSign,
  TrendingUp,
  Percent,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowUpRight,
} from 'lucide-react';

export const VendorEarningsPage: React.FC = () => {
  const { selectedVendorId } = useAuthStore();
  const { vendors, orders, payouts, requestPayout } = useMarketStore();

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(500);

  // Compute revenue figures
  let grossRevenue = 0;
  let commissionDeducted = 0;
  let netEarnings = 0;

  orders.forEach((o) => {
    if (o.orderStatus !== 'cancelled') {
      o.items.forEach((item) => {
        if (item.vendorId === currentVendor.id) {
          grossRevenue += item.subtotal;
          commissionDeducted += item.platformCommission;
          netEarnings += item.vendorEarning;
        }
      });
    }
  });

  const vendorPayouts = payouts.filter((p) => p.vendorId === currentVendor.id);
  const paidPayoutsTotal = vendorPayouts
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const availableBalance = Math.max(0, netEarnings - paidPayoutsTotal);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0) {
      toast.error('Please enter a valid payout amount.');
      return;
    }
    if (payoutAmount > availableBalance) {
      toast.error(`Requested amount exceeds available balance ($${availableBalance.toFixed(2)}).`);
      return;
    }

    requestPayout(currentVendor.id, payoutAmount);
    toast.success(`Payout request of $${payoutAmount.toFixed(2)} submitted for admin processing!`);
    setIsPayoutModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Vendor Earnings & Financial Settlement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent revenue calculation, automated commission deductions, and withdrawal requests
          </p>
        </div>

        <button
          onClick={() => {
            setPayoutAmount(Math.min(availableBalance, 500));
            setIsPayoutModalOpen(true);
          }}
          disabled={availableBalance <= 0}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-4 h-4" />
          Request Settlement Payout
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Gross Marketplace Sales
          </span>
          <div className="text-2xl font-black text-slate-900">${grossRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total customer checkout value</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Platform Commission ({currentVendor.commissionRate}%)
          </span>
          <div className="text-2xl font-black text-rose-600">-${commissionDeducted.toFixed(2)}</div>
          <p className="text-[11px] text-slate-400 mt-1">MarketHub marketplace service fee</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Net Earnings
          </span>
          <div className="text-2xl font-black text-emerald-600">${netEarnings.toFixed(2)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Cumulative settled vendor balance</p>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Available to Withdraw
            </span>
            <div className="text-2xl font-black text-white">${availableBalance.toFixed(2)}</div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Disbursed to: {currentVendor.bankDetails?.bankName || 'Direct Wire'}
          </p>
        </div>
      </div>

      {/* Bank Account Details Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Registered Settlement Account</h3>
              <p className="text-xs text-slate-500">Bank credentials for direct EFT deposit</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Verified Account
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Name</span>
            <span className="font-bold text-slate-800">
              {currentVendor.bankDetails?.bankName || 'Silicon Valley Bank'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Holder</span>
            <span className="font-bold text-slate-800">
              {currentVendor.bankDetails?.holderName || currentVendor.name}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Number</span>
            <span className="font-mono font-bold text-slate-800">
              {currentVendor.bankDetails?.accountNumber || '**** **** 4892'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Routing / IFSC</span>
            <span className="font-mono font-bold text-slate-800">
              {currentVendor.bankDetails?.ifsc || 'SVB000129'}
            </span>
          </div>
        </div>
      </div>

      {/* Payout Settlements History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
          Payout Disbursal History
        </h3>

        {vendorPayouts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Payout Ref</th>
                  <th className="py-3 px-4">Requested Date</th>
                  <th className="py-3 px-4">Disbursed Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vendorPayouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="py-3 px-4 text-slate-600">{p.requestedDate}</td>
                    <td className="py-3 px-4 text-slate-600">{p.paidDate || 'Processing...'}</td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-xs">
            No withdrawal requests made yet for this store.
          </div>
        )}
      </div>

      {/* Request Payout Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Request Settlement Withdrawal"
        subtitle={`Disbursing funds to ${currentVendor.storeName}`}
      >
        <form onSubmit={handleRequestPayout} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500">Available Balance:</span>
            <span className="text-sm font-black text-slate-900 ml-2">
              ${availableBalance.toFixed(2)}
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
              Withdrawal Amount ($)
            </label>
            <input
              type="number"
              min="10"
              max={availableBalance}
              step="1"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            Funds will be transferred directly to your bank account ({currentVendor.bankDetails?.bankName || 'Verified Wire'}) within 24-48 hours upon administrator approval.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPayoutModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-colors"
            >
              Confirm Withdrawal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
