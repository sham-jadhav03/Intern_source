import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from '../../store/useToastStore';
import { RatingStars } from '../../components/common/RatingStars';
import { Modal } from '../../components/common/Modal';
import { StockBadge } from '../../components/common/Badge';
import { ProductCard } from '../../components/customer/ProductCard';
import {
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  Star,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Share2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, vendors, reviews, addToCart, toggleWishlist, isInWishlist, addReview } =
    useMarketStore();
  const { currentUser } = useAuthStore();

  const product = products.find((p) => p.id === id);
  const vendor = vendors.find((v) => v.id === product?.vendorId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Review Form state
  const [userRating, setUserRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          The requested product may have been removed or is no longer listed.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          Return to Marketplace Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  // Filter approved product reviews
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'approved'
  );

  // Related products from same category or vendor
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.vendorId === product.vendorId))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock.');
      return;
    }
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to your cart!`);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock.');
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    if (!inWishlist) {
      toast.success('Saved to wishlist!');
    } else {
      toast.info('Removed from wishlist.');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please enter review remarks.');
      return;
    }

    addReview({
      productId: product.id,
      productTitle: product.title,
      vendorId: product.vendorId,
      customerId: currentUser?.id || 'cust-demo',
      customerName: currentUser?.name || 'Verified Shopper',
      customerAvatar: currentUser?.avatar,
      rating: userRating,
      title: reviewTitle.trim() || 'Verified Purchase Feedback',
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    });

    toast.success('Thank you! Your verified review has been published.');
    setIsReviewModalOpen(false);
    setReviewTitle('');
    setReviewComment('');
    setUserRating(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Strip */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-brand-accent">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <Link to="/products" className="hover:text-brand-accent">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-brand-accent"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-brand-accent text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                {product.discountPercentage}% OFF
              </span>
            )}
            <button
              onClick={handleWishlist}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                inWishlist
                  ? 'bg-rose-50 text-rose-500 ring-2 ring-rose-200 shadow-md'
                  : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white shadow-md'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    selectedImageIndex === idx
                      ? 'border-brand-accent ring-2 ring-brand-accent/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Details & Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Brand & Category badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary bg-slate-100 px-2.5 py-1 rounded-lg">
                {product.brand}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Category: {product.category}
              </span>
            </div>
            <StockBadge stock={product.stock} />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {product.title}
          </h1>

          {/* Rating & Reviews Bar */}
          <div className="flex flex-wrap items-center gap-4 py-2 border-y border-slate-100">
            <div className="flex items-center gap-2">
              <RatingStars rating={product.rating} size="md" />
              <span className="text-sm font-bold text-slate-800">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 font-medium">
              {product.reviewCount} Verified Customer Ratings
            </span>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Write a Review
            </button>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save ${(product.price - displayPrice).toFixed(2)} ({product.discountPercentage}%)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Inclusive of applicable marketplace taxes. Free shipping on orders &gt; $100.
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Vendor Trust Card */}
          {vendor && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={vendor.logo}
                  alt={vendor.storeName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Sold By</span>
                    <h4 className="text-sm font-bold text-slate-900">{vendor.storeName}</h4>
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {vendor.rating}
                    </span>
                    <span>•</span>
                    <span>{vendor.reviewCount} Store Reviews</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/products?vendor=${vendor.id}`}
                className="text-xs font-bold text-brand-accent hover:text-brand-accentHover underline decoration-2 underline-offset-2"
              >
                Visit Store
              </Link>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-sm font-bold text-slate-900 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <span className="text-xs text-slate-500">
                {product.stock > 0 ? `${product.stock} items currently in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-primary hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-accent hover:bg-brand-accentHover text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 fill-white" />
                Buy Now
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            <div className="flex flex-col items-center gap-1 p-2">
              <Truck className="w-4 h-4 text-brand-accent" />
              <span className="font-semibold text-slate-800">Tracked Shipping</span>
              <span className="text-[10px] text-slate-400">3-5 business days</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 border-x border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800">Authentic Guarantee</span>
              <span className="text-[10px] text-slate-400">Direct from vetted seller</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">30-Day Returns</span>
              <span className="text-[10px] text-slate-400">Quick money back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications Section */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Technical Specifications & Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-semibold text-slate-500">{key}</span>
                <span className="font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Customer Feedback & Reviews
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real opinions from verified shoppers on MarketHub
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Write a Review
          </button>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
          <div className="text-center md:text-left space-y-1">
            <div className="text-5xl font-black text-slate-900">{product.rating.toFixed(1)}</div>
            <RatingStars rating={product.rating} size="lg" />
            <p className="text-xs text-slate-500">
              Based on {product.reviewCount} customer reviews
            </p>
          </div>

          <div className="md:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = productReviews.filter((r) => r.rating === stars).length;
              const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-semibold text-slate-600">{stars} Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-slate-400">
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {productReviews.length > 0 ? (
            productReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        rev.customerAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                      }
                      alt={rev.customerName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                    </div>
                  </div>

                  <RatingStars rating={rev.rating} size="sm" />
                </div>

                {rev.title && (
                  <h4 className="text-sm font-bold text-slate-900">{rev.title}</h4>
                )}

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No reviews written for this product yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              You Might Also Like
            </h3>
            <Link
              to="/products"
              className="text-xs font-bold text-brand-accent hover:underline"
            >
              Explore More →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Write a Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write a Customer Review"
        subtitle={`Share your experience with ${product.title}`}
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              <RatingStars
                rating={userRating}
                interactive={true}
                size="lg"
                onRatingChange={(r) => setUserRating(r)}
              />
              <span className="text-xs font-bold text-amber-600 ml-2">{userRating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
              Review Title (Headline)
            </label>
            <input
              type="text"
              placeholder="e.g. Incredible sound clarity, highly recommended!"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
              Your Review & Experience
            </label>
            <textarea
              rows={4}
              placeholder="What did you like or dislike? How was the build quality, performance, and vendor shipping?"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-brand-accent"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold shadow-md transition-colors"
            >
              Publish Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
