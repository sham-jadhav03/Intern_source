import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { Product } from '../../types';
import { Modal } from '../../components/common/Modal';
import { StockBadge } from '../../components/common/Badge';
import { RatingStars } from '../../components/common/RatingStars';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Layers,
  Image as ImageIcon,
  Check,
  ExternalLink,
} from 'lucide-react';

const sampleImages = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800',
];

export const VendorProductsPage: React.FC = () => {
  const { selectedVendorId } = useAuthStore();
  const { products, categories, vendors, addProduct, updateProduct, deleteProduct } =
    useMarketStore();

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  const vendorProducts = products.filter((p) => p.vendorId === currentVendor.id);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState<number>(99.99);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(25);
  const [imageUrl, setImageUrl] = useState(sampleImages[0]);
  const [description, setDescription] = useState('');

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory(categories[0]?.name || 'Electronics');
    setBrand(currentVendor.storeName.split(' ')[0]);
    setPrice(99.00);
    setDiscountPrice(undefined);
    setStock(20);
    setImageUrl(sampleImages[0]);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategory(p.category);
    setBrand(p.brand);
    setPrice(p.price);
    setDiscountPrice(p.discountPrice);
    setStock(p.stock);
    setImageUrl(p.images[0] || sampleImages[0]);
    setDescription(p.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Product title is required.');
      return;
    }

    const calculatedDiscountPercentage =
      discountPrice && discountPrice < price
        ? Math.round(((price - discountPrice) / price) * 100)
        : undefined;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: title.trim(),
        category,
        brand: brand.trim() || currentVendor.storeName,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        discountPercentage: calculatedDiscountPercentage,
        stock: Number(stock),
        images: [imageUrl],
        description: description.trim(),
      });
      toast.success('Product updated successfully!');
    } else {
      addProduct({
        title: title.trim(),
        category,
        brand: brand.trim() || currentVendor.storeName,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        discountPercentage: calculatedDiscountPercentage,
        stock: Number(stock),
        images: [imageUrl],
        description: description.trim(),
        vendorId: currentVendor.id,
        vendorName: currentVendor.storeName,
        isFeatured: true,
      });
      toast.success('Product created & published to customer storefront!');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.success('Product removed from catalog.');
    }
  };

  const filtered = vendorProducts.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
    }
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store's listings, pricing, and stock levels ({vendorProducts.length} Total)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 w-full sm:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search within your products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:border-amber-400"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price / Discount</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4">Customer Rating</th>
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
                          <p className="font-bold text-slate-900 truncate">{product.title}</p>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            Brand: {product.brand}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{product.category}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        ${(product.discountPrice ?? product.price).toFixed(2)}
                      </div>
                      {product.discountPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          ${product.price.toFixed(2)} (-{product.discountPercentage}%)
                        </div>
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
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
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
        ) : (
          <div className="text-center py-16 p-6">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No products match your criteria</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Add products or clear search filters to view your listed inventory.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Add Product Now
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product Details' : 'Add New Product to Storefront'}
        subtitle={`Listing under ${currentVendor.storeName}`}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
              Product Title
            </label>
            <input
              type="text"
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Department / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                placeholder="e.g. Sony, Apple, Nike"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Original Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Discount Price ($) (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 79.99"
                value={discountPrice !== undefined ? discountPrice : ''}
                onChange={(e) =>
                  setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
              Product Image URL & Live Preview
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
                placeholder="https://images.unsplash.com/..."
                required
              />
              <img
                src={imageUrl}
                alt="Preview"
                className="w-11 h-11 rounded-xl object-cover border border-slate-300 shrink-0 shadow-xs"
              />
            </div>

            {/* Quick Preset Images */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] text-slate-400">Presets:</span>
              {sampleImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(img)}
                  className="w-6 h-6 rounded-md overflow-hidden border border-slate-300 hover:scale-110 transition-transform"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 uppercase">
              Product Description
            </label>
            <textarea
              rows={3}
              placeholder="Highlight key selling points, dimensions, material quality, and features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-500"
              required
            />
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
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-colors"
            >
              {editingProduct ? 'Save Updates' : 'Publish Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
