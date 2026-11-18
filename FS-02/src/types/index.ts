export type UserRole = 'customer' | 'vendor' | 'admin';

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  address?: Address;
  vendorId?: string; // If user is vendor
  createdAt: string;
  savedAddresses?: Address[];
}

export interface Vendor {
  id: string;
  name: string;
  storeName: string;
  email: string;
  phone: string;
  logo: string;
  banner: string;
  description: string;
  status: 'approved' | 'pending' | 'rejected' | 'suspended';
  rating: number;
  reviewCount: number;
  commissionRate: number; // percentage, e.g., 10%
  joinedDate: string;
  address: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    holderName: string;
  };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: string[];
  stock: number;
  vendorId: string;
  vendorName: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  specifications?: Record<string, string>;
  tags?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description?: string;
  itemCount: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusStep {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  price: number;
  quantity: number;
  subtotal: number;
  vendorEarning: number;
  platformCommission: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'cod' | 'card' | 'upi' | 'netbanking';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: OrderStatus;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
  statusHistory: OrderStatusStep[];
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  title?: string;
  verifiedPurchase: boolean;
  createdAt: string;
  status: 'approved' | 'pending' | 'flagged';
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface PayoutRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  status: 'paid' | 'pending' | 'processing';
  requestedDate: string;
  paidDate?: string;
}

export interface PlatformSettings {
  siteName: string;
  defaultCommissionRate: number; // e.g. 10
  shippingFee: number;           // e.g. 40
  freeShippingThreshold: number; // e.g. 500
  taxRate: number;               // e.g. 5%
  currencySymbol: string;        // '$' or '₹'
  bannerNotice: string;
  isBannerActive: boolean;
}
