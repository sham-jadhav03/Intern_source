import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { ProductCard } from '../../components/customer/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Star,
  Check,
  RotateCcw,
  PackageOpen,
} from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, vendors } = useMarketStore();

  // URL query params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('q') || '';
  const initialVendor = searchParams.get('vendor') || 'all';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedVendor, setSelectedVendor] = useState(initialVendor);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with searchParams if changed from external (e.g. navbar search)
  React.useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    const ven = searchParams.get('vendor');
    if (q !== null) setSearch(q);
    if (cat !== null) setSelectedCategory(cat);
    if (ven !== null) setSelectedVendor(ven);
  }, [searchParams]);

  // Unique brands
  const brands = useMemo(() => {
    const bSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) bSet.add(p.brand);
    });
    return Array.from(bSet).sort();
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search term
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchBrand && !matchCategory) return false;
        }

        // Category
        if (selectedCategory !== 'all') {
          if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        // Vendor
        if (selectedVendor !== 'all') {
          if (p.vendorId !== selectedVendor) return false;
        }

        // Brand
        if (selectedBrand !== 'all') {
          if (p.brand !== selectedBrand) return false;
        }

        // Price range
        const price = p.discountPrice ?? p.price;
        if (price < minPrice || price > maxPrice) return false;

        // Rating
        if (minRating > 0 && p.rating < minRating) return false;

        // In Stock
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [
    products,
    search,
    selectedCategory,
    selectedVendor,
    selectedBrand,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedVendor('all');
    setSelectedBrand('all');
    setMinPrice(0);
    setMaxPrice(2500);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'all' ||
    selectedVendor !== 'all' ||
    selectedBrand !== 'all' ||
    minPrice > 0 ||
    maxPrice < 2500 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> items
            {selectedCategory !== 'all' && (
              <span> in <span className="font-semibold text-brand-accent">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Filter className="w-4 h-4 text-brand-accent" />
            Filters {hasActiveFilters && '(Active)'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none hover:border-slate-400 focus:border-brand-accent cursor-pointer shadow-sm"
            >
              <option value="featured">Featured / Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs font-semibold text-slate-400">Active Filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              Keyword: "{search}"
              <button onClick={() => setSearch('')} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedVendor !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
              Store: {vendors.find((v) => v.id === selectedVendor)?.storeName}
              <button onClick={() => setSelectedVendor('all')} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedBrand !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              Brand: {selectedBrand}
              <button onClick={() => setSelectedBrand('all')} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {(minPrice > 0 || maxPrice < 2500) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              ${minPrice} - ${maxPrice}
              <button onClick={() => { setMinPrice(0); setMaxPrice(2500); }} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
              {minRating}★ & above
              <button onClick={() => setMinRating(0)} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-2 underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 h-fit shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-accent" />
              Filter Catalog
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Search inside catalog */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
              Keyword Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title, model, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-accent"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              Department
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-brand-primary text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Departments</span>
                <span>{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-brand-accent text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              Price Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={maxPrice}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium outline-none focus:border-brand-accent"
                placeholder="Min"
              />
              <span className="text-slate-400 text-xs">to</span>
              <input
                type="number"
                min={minPrice}
                max={3000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium outline-none focus:border-brand-accent"
                placeholder="Max"
              />
            </div>
            <input
              type="range"
              min={0}
              max={2500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full mt-3 accent-brand-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$0</span>
              <span>$2,500</span>
            </div>
          </div>

          {/* Customer Rating */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              Minimum Customer Rating
            </label>
            <div className="space-y-1">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    minRating === stars
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    ))}
                    <span className="text-slate-700 text-xs ml-1">& up</span>
                  </span>
                  {minRating === stars && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-brand-accent cursor-pointer"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Vendor Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
              Vendor Store
            </label>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-brand-accent cursor-pointer"
            >
              <option value="all">All Verified Stores</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.storeName} ({v.status})
                </option>
              ))}
            </select>
          </div>

          {/* In Stock Only */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent border-slate-300"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Try loosening your filters, broadening your price range, or clearing keywords to see more items.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-primary text-white hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-accent" />
                Filter Products
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Department */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase">Department</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              >
                <option value="all">All Departments</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase">
                Max Price: ${maxPrice}
              </label>
              <input
                type="range"
                min={0}
                max={2500}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-accent"
              />
            </div>

            {/* In stock */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-brand-accent"
              />
              <span>In-Stock Items Only</span>
            </label>

            <div className="pt-4 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
