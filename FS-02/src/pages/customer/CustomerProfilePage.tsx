import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { Address } from '../../types';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Star,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
} from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { currentUser, updateProfile, addAddress, removeAddress, setDefaultAddress } =
    useAuthStore();
  const { orders, wishlist, reviews } = useMarketStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Sarah Jenkins');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 123-4567');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Address>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const customerOrders = orders.filter(
    (o) => o.customerEmail === currentUser?.email || o.customerId === currentUser?.id
  );
  const customerReviews = reviews.filter((r) => r.customerId === currentUser?.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, avatar });
    setIsEditing(false);
    toast.success('Profile details updated successfully!');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city) {
      toast.error('Please fill in street and city.');
      return;
    }
    addAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({
      fullName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
    });
    toast.success('Address saved to address book!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Customer Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your personal details, shipping addresses, and preferences
        </p>
      </div>

      {/* Top Profile Card & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main User Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={
              currentUser?.avatar ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
            }
            alt={currentUser?.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-accent shadow-md shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            {!isEditing ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{currentUser?.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 self-center sm:self-start"
                  >
                    Edit Details
                  </button>
                </div>
                <div className="pt-2 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser?.phone || '+1 (555) 123-4567'}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Member since {currentUser?.createdAt || '2023-02-14'}</span>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3 w-full">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-brand-accent"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between shadow-md">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Account Activity
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center py-4">
            <div>
              <span className="text-2xl font-black text-brand-accent">{customerOrders.length}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Orders</span>
            </div>
            <div className="border-x border-slate-800">
              <span className="text-2xl font-black text-white">{wishlist.length}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Wishlist</span>
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-400">{customerReviews.length}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Reviews</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Status: <span className="text-emerald-400 font-bold">Verified Shopper Tier 1</span>
          </div>
        </div>
      </div>

      {/* Address Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-accent" />
              Saved Delivery Addresses
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Addresses used for automated one-click shipping calculations
            </p>
          </div>

          <button
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAddingAddress ? 'Cancel' : 'Add New Address'}
          </button>
        </div>

        {/* New Address Form */}
        {isAddingAddress && (
          <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Add New Shipping Destination
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Phone</label>
                <input
                  type="text"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Street Address</label>
              <input
                type="text"
                placeholder="Street address, apartment, suite"
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">City</label>
                <input
                  type="text"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">State</label>
                <input
                  type="text"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-accent text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(currentUser?.savedAddresses || []).map((addr, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                addr.isDefault ? 'border-brand-primary bg-slate-50/70' : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-brand-primary bg-blue-100 px-2 py-0.5 rounded-full">
                      Default Shipping Address
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-1">Phone: {addr.phone}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => {
                      setDefaultAddress(idx);
                      toast.success('Default address updated.');
                    }}
                    className="text-brand-accent hover:underline font-semibold text-[11px]"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Primary
                  </span>
                )}

                <button
                  onClick={() => {
                    removeAddress(idx);
                    toast.info('Address removed.');
                  }}
                  className="text-rose-500 hover:text-rose-700 p-1"
                  title="Delete address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
