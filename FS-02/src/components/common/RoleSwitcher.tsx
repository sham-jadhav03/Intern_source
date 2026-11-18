import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import {
  Users,
  Store,
  ShieldAlert,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, loginAs, selectedVendorId } = useAuthStore();
  const { vendors, resetToDemoData } = useMarketStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (newRole: 'customer' | 'vendor' | 'admin', vendorId?: string) => {
    loginAs(newRole, undefined, vendorId);
    setIsOpen(false);

    toast.info(`Switched role to ${newRole.toUpperCase()}${vendorId ? ` (${vendors.find(v => v.id === vendorId)?.storeName})` : ''}`);

    if (newRole === 'customer') {
      if (location.pathname.startsWith('/vendor') || location.pathname.startsWith('/admin')) {
        navigate('/');
      }
    } else if (newRole === 'vendor') {
      navigate('/vendor');
    } else if (newRole === 'admin') {
      navigate('/admin');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all product, order, review, and vendor data back to demo defaults?')) {
      resetToDemoData();
      toast.success('MarketHub demo state successfully restored!');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 shadow-sm
          bg-slate-900 text-white border-slate-700 hover:bg-slate-800"
      >
        <span className="flex items-center gap-1.5">
          {role === 'customer' && <Users className="w-3.5 h-3.5 text-blue-400" />}
          {role === 'vendor' && <Store className="w-3.5 h-3.5 text-amber-400" />}
          {role === 'admin' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
          <span className="uppercase tracking-wider">Demo Role: {role}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                Switch Demo Perspective
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Instant role jump with live reactive state
              </p>
            </div>

            <div className="p-1.5 space-y-1">
              {/* Customer */}
              <button
                onClick={() => handleRoleChange('customer')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                  role === 'customer'
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Customer View</div>
                    <div className="text-[10px] text-slate-500">customer@markethub.com</div>
                  </div>
                </div>
                {role === 'customer' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              {/* Vendor Selector */}
              <div className="pt-1">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Vendor Dashboard Roles
                </div>
                {vendors.map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => handleRoleChange('vendor', vendor.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      role === 'vendor' && selectedVendorId === vendor.id
                        ? 'bg-amber-50 text-amber-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={vendor.logo}
                        alt={vendor.storeName}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                      />
                      <div className="truncate max-w-[170px]">
                        <div className="font-medium text-slate-900 truncate">
                          {vendor.storeName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {vendor.email} ({vendor.status})
                        </div>
                      </div>
                    </div>
                    {role === 'vendor' && selectedVendorId === vendor.id && (
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Admin */}
              <div className="pt-1">
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                    role === 'admin'
                      ? 'bg-rose-50 text-rose-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Admin Control Panel</div>
                      <div className="text-[10px] text-slate-500">admin@markethub.com</div>
                    </div>
                  </div>
                  {role === 'admin' && <Check className="w-4 h-4 text-rose-600" />}
                </button>
              </div>
            </div>

            <div className="mt-1 pt-2 border-t border-slate-100 px-2 pb-1">
              <button
                onClick={handleResetData}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo to Clean State
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
