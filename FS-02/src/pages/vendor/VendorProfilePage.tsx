import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Building2,
  Save,
  CheckCircle2,
  ShieldCheck,
  Star,
} from 'lucide-react';

export const VendorProfilePage: React.FC = () => {
  const { selectedVendorId } = useAuthStore();
  const { vendors, updateVendorProfile } = useMarketStore();

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  const [storeName, setStoreName] = useState(currentVendor.storeName);
  const [email, setEmail] = useState(currentVendor.email);
  const [phone, setPhone] = useState(currentVendor.phone);
  const [address, setAddress] = useState(currentVendor.address);
  const [description, setDescription] = useState(currentVendor.description);
  const [logo, setLogo] = useState(currentVendor.logo);
  const [banner, setBanner] = useState(currentVendor.banner);

  const [bankName, setBankName] = useState(currentVendor.bankDetails?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(
    currentVendor.bankDetails?.accountNumber || ''
  );
  const [ifsc, setIfsc] = useState(currentVendor.bankDetails?.ifsc || '');
  const [holderName, setHolderName] = useState(currentVendor.bankDetails?.holderName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendorProfile(currentVendor.id, {
      storeName,
      email,
      phone,
      address,
      description,
      logo,
      banner,
      bankDetails: {
        bankName,
        accountNumber,
        ifsc,
        holderName,
      },
    });
    toast.success('Store profile & banking details updated successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Store Front & Business Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Public brand representation, seller contact details, and settlement configuration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Banner & Logo Visual Preview Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Banner */}
          <div className="relative h-44 sm:h-56 w-full bg-slate-900">
            <img src={banner} alt="Store Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-white text-[11px] font-medium border border-white/20">
              Live Banner Preview
            </div>
          </div>

          {/* Logo & Identity */}
          <div className="p-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
            <div className="flex items-end gap-4">
              <img
                src={logo}
                alt={storeName}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-white shrink-0"
              />
              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{storeName}</h3>
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {currentVendor.rating}
                  </span>
                  <span>•</span>
                  <span>{currentVendor.reviewCount} Reviews</span>
                  <span>•</span>
                  <span className="capitalize font-semibold text-emerald-600">
                    Status: {currentVendor.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all self-start sm:self-auto"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </div>

        {/* Media Assets Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Store Branding Assets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Store Logo Image URL
              </label>
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Store Banner Image URL
              </label>
              <input
                type="url"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Business & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Store Display Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Customer Support Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Registered Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
              Store Bio / About Brand
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
              required
            />
          </div>
        </div>

        {/* Banking Settlement Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-accent" />
            Payout Banking Account Setup
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Financial Institution / Bank
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                placeholder="e.g. JPMorgan Chase Bank"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Beneficiary / Account Holder Name
              </label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Routing Code / IFSC
              </label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all"
          >
            Save All Profile & Banking Settings
          </button>
        </div>
      </form>
    </div>
  );
};
