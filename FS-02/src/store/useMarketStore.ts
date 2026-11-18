import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Product,
  Category,
  Vendor,
  User,
  Order,
  OrderItem,
  OrderStatus,
  Review,
  Coupon,
  CartItem,
  PlatformSettings,
  PayoutRequest,
  Address,
} from '../types';
import {
  initialCategories,
  initialVendors,
  initialProducts,
  initialCustomers,
  initialOrders,
  initialReviews,
  initialCoupons,
  initialPayouts,
  defaultSettings,
} from '../data/seedData';

interface MarketState {
  products: Product[];
  categories: Category[];
  vendors: Vendor[];
  customers: User[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  payouts: PayoutRequest[];
  settings: PlatformSettings;
  cart: CartItem[];
  wishlist: string[];
  appliedCoupon: Coupon | null;

  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;

  // Vendor Actions
  updateVendorStatus: (vendorId: string, status: 'approved' | 'pending' | 'rejected' | 'suspended') => void;
  updateVendorProfile: (vendorId: string, updates: Partial<Vendor>) => void;
  updateVendorCommission: (vendorId: string, rate: number) => void;

  // Order Actions
  createOrder: (orderData: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: Address;
    paymentMethod: 'cod' | 'card' | 'upi' | 'netbanking';
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Review Actions
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  deleteReview: (reviewId: string) => void;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'pending' | 'flagged') => void;

  // Coupon Actions
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;

  // Payout Actions
  requestPayout: (vendorId: string, amount: number) => void;
  updatePayoutStatus: (id: string, status: 'paid' | 'pending' | 'processing') => void;

  // Settings Actions
  updateSettings: (updates: Partial<PlatformSettings>) => void;

  // Computed Cart Helpers
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartShippingFee: () => number;
  getCartTotal: () => number;

  // Reset to initial seed data
  resetToDemoData: () => void;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      categories: initialCategories,
      vendors: initialVendors,
      customers: initialCustomers,
      orders: initialOrders,
      reviews: initialReviews,
      coupons: initialCoupons,
      payouts: initialPayouts,
      settings: defaultSettings,
      cart: [
        {
          productId: 'prod-1',
          product: initialProducts[0],
          quantity: 1,
        },
      ],
      wishlist: ['prod-2', 'prod-9', 'prod-20'],
      appliedCoupon: null,

      // Product Actions
      addProduct: (productData) => {
        const id = 'prod-' + Date.now();
        const newProduct: Product = {
          ...productData,
          id,
          rating: 5.0,
          reviewCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
        return newProduct;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          cart: state.cart.filter((item) => item.productId !== id),
          wishlist: state.wishlist.filter((prodId) => prodId !== id),
        }));
      },

      updateStock: (id, newStock) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, newStock) } : p
          ),
        }));
      },

      // Vendor Actions
      updateVendorStatus: (vendorId, status) => {
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === vendorId ? { ...v, status } : v)),
        }));
      },

      updateVendorProfile: (vendorId, updates) => {
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === vendorId ? { ...v, ...updates } : v)),
        }));
      },

      updateVendorCommission: (vendorId, rate) => {
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === vendorId ? { ...v, commissionRate: rate } : v
          ),
        }));
      },

      // Cart Actions
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.cart.findIndex((item) => item.productId === product.id);
          if (existingIndex > -1) {
            const updated = [...state.cart];
            const newQty = updated[existingIndex].quantity + quantity;
            if (newQty <= product.stock) {
              updated[existingIndex].quantity = newQty;
            }
            return { cart: updated };
          } else {
            return {
              cart: [...state.cart, { productId: product.id, product, quantity: Math.min(quantity, product.stock) }],
            };
          }
        });
      },

      updateCartQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              cart: state.cart.filter((item) => item.productId !== productId),
            };
          }
          return {
            cart: state.cart.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        }));
      },

      clearCart: () => {
        set({ cart: [], appliedCoupon: null });
      },

      applyCoupon: (code: string) => {
        const state = get();
        const trimmed = code.trim().toUpperCase();
        const coupon = state.coupons.find(
          (c) => c.code.toUpperCase() === trimmed && c.isActive
        );

        if (!coupon) {
          return { success: false, message: 'Invalid or inactive coupon code.' };
        }

        const subtotal = state.getCartSubtotal();
        if (subtotal < coupon.minOrderAmount) {
          return {
            success: false,
            message: `Minimum order amount for ${coupon.code} is $${coupon.minOrderAmount.toFixed(2)}.`,
          };
        }

        set({ appliedCoupon: coupon });
        return {
          success: true,
          message: `Coupon ${coupon.code} applied successfully!`,
        };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      // Wishlist
      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        });
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      // Computed Cart calculations
      getCartSubtotal: () => {
        const cart = get().cart;
        return cart.reduce((acc, item) => {
          const price = item.product.discountPrice ?? item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },

      getCartDiscount: () => {
        const subtotal = get().getCartSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon || subtotal < coupon.minOrderAmount) return 0;

        let discount = 0;
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        return Math.min(discount, subtotal);
      },

      getCartShippingFee: () => {
        const subtotal = get().getCartSubtotal();
        const settings = get().settings;
        const coupon = get().appliedCoupon;
        if (subtotal === 0) return 0;
        if (coupon?.code === 'FREESHIP') return 0;
        if (subtotal >= settings.freeShippingThreshold) return 0;
        return settings.shippingFee;
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const discount = get().getCartDiscount();
        const shipping = get().getCartShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },

      // Order creation
      createOrder: ({
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
      }) => {
        const state = get();
        const orderId = 'ord-' + Date.now();
        const orderNumber = 'MH-' + Math.floor(10000 + Math.random() * 90000);
        const subtotal = state.getCartSubtotal();
        const discount = state.getCartDiscount();
        const shippingFee = state.getCartShippingFee();
        const total = state.getCartTotal();
        const couponCode = state.appliedCoupon?.code;

        // Build order items with vendor commission calculation
        const items: OrderItem[] = state.cart.map((cartItem) => {
          const itemPrice = cartItem.product.discountPrice ?? cartItem.product.price;
          const itemSubtotal = itemPrice * cartItem.quantity;
          const vendor = state.vendors.find((v) => v.id === cartItem.product.vendorId);
          const commissionRate = vendor?.commissionRate ?? state.settings.defaultCommissionRate;
          const platformCommission = (itemSubtotal * commissionRate) / 100;
          const vendorEarning = itemSubtotal - platformCommission;

          return {
            productId: cartItem.productId,
            productTitle: cartItem.product.title,
            productImage: cartItem.product.images[0] || '',
            vendorId: cartItem.product.vendorId,
            vendorName: cartItem.product.vendorName,
            price: itemPrice,
            quantity: cartItem.quantity,
            subtotal: itemSubtotal,
            vendorEarning,
            platformCommission,
          };
        });

        // Decrement product inventory
        const updatedProducts = state.products.map((prod) => {
          const orderedItem = state.cart.find((ci) => ci.productId === prod.id);
          if (orderedItem) {
            return {
              ...prod,
              stock: Math.max(0, prod.stock - orderedItem.quantity),
            };
          }
          return prod;
        });

        const newOrder: Order = {
          id: orderId,
          orderNumber,
          customerId,
          customerName,
          customerEmail,
          customerPhone,
          items,
          shippingAddress,
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          orderStatus: 'placed',
          subtotal,
          discount,
          couponCode,
          shippingFee,
          total,
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          statusHistory: [
            {
              status: 'placed',
              timestamp: new Date().toISOString(),
              note: `Order placed successfully via ${paymentMethod.toUpperCase()}.`,
            },
          ],
        };

        // Increment coupon usage
        const updatedCoupons = state.coupons.map((c) =>
          c.code === couponCode ? { ...c, usageCount: c.usageCount + 1 } : c
        );

        set({
          orders: [newOrder, ...state.orders],
          products: updatedProducts,
          coupons: updatedCoupons,
          cart: [],
          appliedCoupon: null,
        });

        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus, note) => {
        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;
            const updatedHistory = [
              ...ord.statusHistory,
              {
                status: newStatus,
                timestamp: new Date().toISOString(),
                note: note || `Order status updated to ${newStatus}.`,
              },
            ];
            return {
              ...ord,
              orderStatus: newStatus,
              paymentStatus: newStatus === 'delivered' ? 'paid' : ord.paymentStatus,
              statusHistory: updatedHistory,
            };
          }),
        }));
      },

      cancelOrder: (orderId, reason) => {
        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;
            return {
              ...ord,
              orderStatus: 'cancelled',
              statusHistory: [
                ...ord.statusHistory,
                {
                  status: 'cancelled',
                  timestamp: new Date().toISOString(),
                  note: reason || 'Cancelled by customer/admin.',
                },
              ],
            };
          }),
        }));
      },

      // Reviews
      addReview: (reviewData) => {
        const id = 'rev-' + Date.now();
        const newReview: Review = {
          ...reviewData,
          id,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'approved',
        };

        // Update product rating and review count
        set((state) => {
          const productReviews = state.reviews.filter(
            (r) => r.productId === reviewData.productId && r.status === 'approved'
          );
          const allRatings = [...productReviews.map((r) => r.rating), reviewData.rating];
          const avgRating = Number(
            (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
          );

          const updatedProducts = state.products.map((p) =>
            p.id === reviewData.productId
              ? {
                  ...p,
                  rating: avgRating,
                  reviewCount: p.reviewCount + 1,
                }
              : p
          );

          return {
            reviews: [newReview, ...state.reviews],
            products: updatedProducts,
          };
        });
      },

      deleteReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== reviewId),
        }));
      },

      updateReviewStatus: (reviewId, status) => {
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === reviewId ? { ...r, status } : r)),
        }));
      },

      // Coupons
      addCoupon: (couponData) => {
        const newCoupon: Coupon = {
          ...couponData,
          id: 'coup-' + Date.now(),
          usageCount: 0,
        };
        set((state) => ({
          coupons: [newCoupon, ...state.coupons],
        }));
      },

      updateCoupon: (id, updates) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        }));
      },

      toggleCouponActive: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        }));
      },

      // Payouts
      requestPayout: (vendorId, amount) => {
        const vendor = get().vendors.find((v) => v.id === vendorId);
        const newPayout: PayoutRequest = {
          id: 'pay-' + Date.now(),
          vendorId,
          vendorName: vendor?.storeName || 'Vendor',
          amount,
          status: 'pending',
          requestedDate: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          payouts: [newPayout, ...state.payouts],
        }));
      },

      updatePayoutStatus: (id, status) => {
        set((state) => ({
          payouts: state.payouts.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : p.paidDate,
                }
              : p
          ),
        }));
      },

      // Platform Settings
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      resetToDemoData: () => {
        set({
          products: initialProducts,
          categories: initialCategories,
          vendors: initialVendors,
          customers: initialCustomers,
          orders: initialOrders,
          reviews: initialReviews,
          coupons: initialCoupons,
          payouts: initialPayouts,
          settings: defaultSettings,
          appliedCoupon: null,
          cart: [
            {
              productId: 'prod-1',
              product: initialProducts[0],
              quantity: 1,
            },
          ],
          wishlist: ['prod-2', 'prod-9', 'prod-20'],
        });
      },
    }),
    {
      name: 'markethub-core-storage',
    }
  )
);
