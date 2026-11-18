import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { StockBadge } from '../../components/common/Badge';
import { RatingStars } from '../../components/common/RatingStars';
import {
  Package,
  Search,
  Trash2,
  ExternalLink,
  Store,
  Sparkles,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, vendors, deleteProduct, updateProduct } = useMarketStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('all');

  const filtered = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
    }
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedVendor !== 'all' && p.vendorId !== selectedVendor) return false;
    return true;
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete product "${title}" permanently across all vendor catalogs?`)) {
      deleteProduct(id);
      toast.success('Product deleted.');
    }
  };

  const handleToggleFeatured = (id: string, current: boolean | undefined) => {
    updateProduct(id, { isFeatured: !current });
    toast.success(!current ? 'Product marked as Featured.' : 'Product unfeatured.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Global Product Inventory Registry
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Supervise and moderate listings from all verified vendors ({products.length} Products Total)
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 w-full sm:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search catalog by title, brand, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:border-rose-500"
          >
            <option value="all">All Departments</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:border-rose-500"
          >
            <option value="all">All Sellers</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.storeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Item & Brand</th>
                <th className="py-3.5 px-4">Vendor Store</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Price / Discount</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="max-w-xs">
                        <Link
                          to={`/products/${product.id}`}
                          className="font-bold text-slate-900 hover:text-brand-accent line-clamp-1"
                        >
                          {product.title}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          Brand: {product.brand}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      <span>{product.vendorName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{product.category}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">
                      ${(product.discountPrice ?? product.price).toFixed(2)}
                    </div>
                    {product.discountPrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="py-3.5 px-4">
                    <RatingStars rating={product.rating} size="sm" showText reviewCount={product.reviewCount} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          product.isFeatured
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                        title="Toggle Featured Homepage Placement"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
