import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { StockBadge } from '../../components/common/Badge';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Search,
  Save,
  Package,
} from 'lucide-react';

export const VendorInventoryPage: React.FC = () => {
  const { selectedVendorId } = useAuthStore();
  const { products, vendors, updateStock } = useMarketStore();

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  const vendorProducts = products.filter((p) => p.vendorId === currentVendor.id);

  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');
  const [localStock, setLocalStock] = useState<Record<string, number>>({});

  const totalStockUnits = vendorProducts.reduce((acc, p) => acc + p.stock, 0);
  const lowStockItems = vendorProducts.filter((p) => p.stock > 0 && p.stock <= 10);
  const outOfStockItems = vendorProducts.filter((p) => p.stock <= 0);

  const handleStockInputChange = (productId: string, val: number) => {
    setLocalStock((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleSaveStock = (productId: string, fallbackCurrent: number) => {
    const updatedValue = localStock[productId] !== undefined ? localStock[productId] : fallbackCurrent;
    updateStock(productId, updatedValue);
    toast.success('Inventory stock level updated!');
  };

  const handleQuickAdd = (productId: string, current: number, delta: number) => {
    const newStock = Math.max(0, current + delta);
    updateStock(productId, newStock);
    setLocalStock((prev) => ({ ...prev, [productId]: newStock }));
    toast.success(`Inventory updated to ${newStock} units.`);
  };

  const filtered = vendorProducts.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q)) return false;
    }
    if (filterType === 'low') return p.stock > 0 && p.stock <= 10;
    if (filterType === 'out') return p.stock <= 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Inventory Control & Stock Alerts
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time warehouse tracking and replenish alerts for {currentVendor.storeName}
        </p>
      </div>

      {/* Stock Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Units in Stock
            </span>
            <span className="text-3xl font-black text-slate-900">{totalStockUnits}</span>
            <span className="text-xs text-slate-500 block mt-1">
              Across {vendorProducts.length} listed models
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Low Stock Warnings
            </span>
            <span className="text-3xl font-black text-amber-600">{lowStockItems.length}</span>
            <span className="text-xs text-amber-600 font-semibold block mt-1">
              ≤ 10 units remaining
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Out of Stock Products
            </span>
            <span className="text-3xl font-black text-rose-600">{outOfStockItems.length}</span>
            <span className="text-xs text-rose-500 block mt-1">
              Requires immediate replenishment
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 w-full sm:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search inventory items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Items ({vendorProducts.length})
          </button>
          <button
            onClick={() => setFilterType('low')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'low'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Low Stock ({lowStockItems.length})
          </button>
          <button
            onClick={() => setFilterType('out')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'out'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Out of Stock ({outOfStockItems.length})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Item Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Unit Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4 text-right">Quick Restock / Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((product) => {
                  const currentValue =
                    localStock[product.id] !== undefined ? localStock[product.id] : product.stock;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="max-w-xs">
                            <p className="font-bold text-slate-900 truncate">{product.title}</p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{product.category}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ${(product.discountPrice ?? product.price).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StockBadge stock={product.stock} />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={currentValue}
                            onChange={(e) =>
                              handleStockInputChange(product.id, Number(e.target.value))
                            }
                            className="w-20 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-400"
                          />
                          {localStock[product.id] !== undefined &&
                            localStock[product.id] !== product.stock && (
                              <button
                                onClick={() => handleSaveStock(product.id, product.stock)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                title="Save changes"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                            )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleQuickAdd(product.id, product.stock, 5)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleQuickAdd(product.id, product.stock, 25)}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors"
                            title="Add 25 units"
                          >
                            +25
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No inventory items matching the current filter.
          </div>
        )}
      </div>
    </div>
  );
};
