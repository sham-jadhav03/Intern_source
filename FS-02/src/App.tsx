import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from './components/common/ToastContainer';

// Customer Pages & Layout
import { CustomerLayout } from './components/customer/CustomerLayout';
import { HomePage } from './pages/customer/HomePage';
import { ProductListingPage } from './pages/customer/ProductListingPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { OrderHistoryPage } from './pages/customer/OrderHistoryPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { LoginPage } from './pages/auth/LoginPage';

// Vendor Pages & Layout
import { VendorDashboardLayout } from './pages/vendor/VendorDashboardLayout';
import { VendorOverviewPage } from './pages/vendor/VendorOverviewPage';
import { VendorProductsPage } from './pages/vendor/VendorProductsPage';
import { VendorOrdersPage } from './pages/vendor/VendorOrdersPage';
import { VendorInventoryPage } from './pages/vendor/VendorInventoryPage';
import { VendorEarningsPage } from './pages/vendor/VendorEarningsPage';
import { VendorProfilePage } from './pages/vendor/VendorProfilePage';
import { VendorReviewsPage } from './pages/vendor/VendorReviewsPage';

// Admin Pages & Layout
import { AdminDashboardLayout } from './pages/admin/AdminDashboardLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminVendorsPage } from './pages/admin/AdminVendorsPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCommissionsPage } from './pages/admin/AdminCommissionsPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Customer & Storefront Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListingPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Vendor Portal Routes */}
        <Route path="/vendor" element={<VendorDashboardLayout />}>
          <Route index element={<VendorOverviewPage />} />
          <Route path="products" element={<VendorProductsPage />} />
          <Route path="orders" element={<VendorOrdersPage />} />
          <Route path="inventory" element={<VendorInventoryPage />} />
          <Route path="earnings" element={<VendorEarningsPage />} />
          <Route path="profile" element={<VendorProfilePage />} />
          <Route path="reviews" element={<VendorReviewsPage />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="vendors" element={<AdminVendorsPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="commissions" element={<AdminCommissionsPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast Notifications for all dashboards */}
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
