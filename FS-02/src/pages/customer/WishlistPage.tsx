import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { toast } from '../../store/useToastStore';
import { RatingStars } from '../../components/common/RatingStars';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart } = useMarketStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
    toast.success(`Moved "${product.title}" to your cart!`);
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-6 shadow-inner">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Wishlist is Empty</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-2 mb-8">
          Save your favorite products while browsing and keep track of special discount drops.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-brand-primary text-white hover:bg-slate-800 transition-colors shadow-md"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {wishlistedProducts.length} saved product(s) in your personal list
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistedProducts.map((product) => {
          const displayPrice = product.discountPrice ?? product.price;

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.info('Removed from wishlist.');
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-md transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1 space-y-2">
                <span className="text-[11px] font-semibold text-brand-secondary">
                  {product.category}
                </span>

                <Link
                  to={`/products/${product.id}`}
                  className="text-xs font-bold text-slate-900 hover:text-brand-accent line-clamp-2"
                >
                  {product.title}
                </Link>

                <RatingStars rating={product.rating} size="sm" showText reviewCount={product.reviewCount} />

                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-base font-black text-slate-900">
                    ${displayPrice.toFixed(2)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-brand-primary hover:bg-brand-accent text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
