import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { RatingStars } from '../common/RatingStars';
import { Heart, ShoppingBag, Eye, Store, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, cart } = useMarketStore();
  const inWishlist = isInWishlist(product.id);
  const cartItem = cart.find((item) => item.productId === product.id);

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error('This product is currently out of stock.');
      return;
    }
    addToCart(product, 1);
    toast.success(`Added "${product.title.substring(0, 28)}..." to cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!inWishlist) {
      toast.success('Saved to your wishlist!');
    } else {
      toast.info('Removed from wishlist.');
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-slate-100 block">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-md shadow-sm">
              Best Seller
            </span>
          )}
          {product.isTrending && !product.isBestSeller && (
            <span className="bg-blue-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-sm">
              Trending
            </span>
          )}
          {hasDiscount && (
            <span className="bg-brand-accent text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm">
              {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'SALE'}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            inWishlist
              ? 'bg-rose-50 text-rose-500 shadow-md ring-2 ring-rose-200'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white shadow-sm'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5 text-brand-accent" /> View Details
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Vendor & Category tag */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
          <span className="font-semibold text-brand-secondary truncate max-w-[140px]">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-slate-400 truncate max-w-[110px]" title={product.vendorName}>
            <Store className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{product.vendorName}</span>
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product.id}`}
          className="text-sm font-bold text-slate-900 hover:text-brand-accent line-clamp-2 leading-snug mb-2 group-hover:underline underline-offset-2 transition-colors"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Ratings */}
        <div className="mb-3">
          <RatingStars
            rating={product.rating}
            size="sm"
            showText={true}
            reviewCount={product.reviewCount}
          />
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-[10px] font-semibold text-amber-600">
                Only {product.stock} left in stock
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-[10px] font-bold text-rose-600">
                Out of Stock
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : cartItem
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-brand-primary hover:bg-brand-accent text-white'
            }`}
            title="Add to Cart"
          >
            {cartItem ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline font-bold">({cartItem.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
