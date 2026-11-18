# MarketHub — Multi-Vendor E-Commerce Marketplace Prototype

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.3-38B2AC.svg)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State_&_Persistence-orange.svg)](https://github.com/pmndrs/zustand)
[![Recharts](https://img.shields.io/badge/Recharts-Analytics-purple.svg)](https://recharts.org/)

**MarketHub** is an enterprise-grade multi-vendor e-commerce marketplace prototype developed for **FS-01: Full-Stack Development Specialization**. Inspired by leading commercial marketplaces such as Amazon, Flipkart, and modern SaaS merchant ecosystems, MarketHub provides three synchronized, fully-featured dashboards (Customer Storefront, Vendor Dashboard, and Admin Control Panel) with instant role switching, realistic seed data, and persistent browser storage.

---

## 🌟 Key Highlights & Architectural Features

### 1. 🛍️ Customer Storefront
- **Modern Homepage:**
  - Dynamic promotional announcement header with customizable promo banner.
  - Interactive hero banner carousel with call-to-actions.
  - Category strip with 8 diverse departments.
  - Daily flash deals section with live countdown clock.
  - Trending products & all-time best seller showcases.
  - Featured verified vendor merchant spotlights.
  - Comprehensive multi-column footer with customer care links.
- **Product Catalog & Filtering:**
  - Full-text search with live debounce.
  - Multi-faceted sidebar filters: Category, Price range slider, Star ratings (4★, 3★, 2★ & up), Brand filter, Vendor filter, In-stock only toggle.
  - Sorting: Featured, Price Low-to-High, Price High-to-Low, Highest Rated, Newest Arrivals.
  - Removable active filter chips & empty state with 1-click filter reset.
- **Product Detail Experience:**
  - High-resolution gallery with thumbnail switcher.
  - Stock availability badges with low-stock warnings.
  - Verified merchant seller card with rating and direct link to vendor store.
  - Quantity selector, "Add to Cart", and instant "Buy Now" flow.
  - Detailed technical specifications table.
  - Customer review summary breakdown (5-star distribution meters) and verified customer testimonials.
  - Interactive "Write a Review" modal with interactive star picker and live rating updates.
- **Cart & Checkout:**
  - Shopping cart with item quantity steppers, item removal, and subtotal calculation.
  - Promo code engine with coupon verification (e.g., `WELCOME10`, `MEGA20`, `FREESHIP`, `TECHSAVE`) and 1-click demo coupon chips.
  - Multi-step checkout with saved shipping address book, new address form, and payment options (Simulated Card, UPI, and Cash on Delivery).
  - Order confirmation screen with reference ID and direct shipment tracking links.
- **Order Tracking & Account:**
  - Live 6-stage order tracking progress stepper (`Placed` → `Confirmed` → `Processing` → `Shipped` → `Out for Delivery` → `Delivered`).
  - Detailed status event history timeline with timestamps and notes.
  - Order cancellation option for pending orders.
  - Personal wishlist with 1-click "Move to Cart".
  - Customer profile with saved delivery addresses management.

---

### 2. 🏪 Vendor Command Center
- **Executive Overview:**
  - Real-time KPI cards: Gross Store Sales, Total Store Orders, Active Listed Inventory, Low Stock warnings.
  - Net vendor earnings calculation after automatic platform commission deduction.
  - Recharts Weekly Revenue Area Chart & Daily Order Frequency Bar Chart.
  - Recent customer orders fulfilled by the current vendor.
- **Product Management (Full CRUD):**
  - List of all store products with image previews, category tags, pricing, and stock levels.
  - Search & category filter.
  - "Add Product" modal with live image preview, preset image selection, pricing, discounts, and inventory counts. Products added immediately appear in the customer storefront.
  - "Edit Product" and "Delete Product" actions.
- **Order Fulfillment Desk:**
  - Filter orders containing items belonging to the vendor.
  - Customer details, shipping address, and line item financial breakdown.
  - Real-time status update selector (`Placed` → `Processing` → `Shipped` → `Delivered` → `Cancelled`).
- **Inventory Control & Alerts:**
  - Total units in stock, low-stock warnings (≤10 units), and out-of-stock highlights.
  - Quick-restock buttons (+5, +25 units) and custom stock input with instant save.
- **Earnings & Settlement Payouts:**
  - Financial breakdown: Gross Revenue, Platform Commission Fee, Net Vendor Earnings.
  - Verified settlement bank details (Silicon Valley Bank, account number, routing code).
  - Payout history ledger with status indicators (`Paid`, `Pending`).
  - "Request Settlement Withdrawal" modal with balance validation.
- **Store Profile & Customization:**
  - Public branding: Store banner image, store logo, display name, support email, phone, physical address, and store bio.
  - Direct preview of live storefront.
- **Customer Feedback & Ratings:**
  - Aggregated store star rating.
  - Review feed for the vendor's products with customer names and verified purchase tags.

---

### 3. 🛡️ Administrator Platform Control Panel
- **Executive Overview:**
  - Global Gross Merchandise Value (GMV), Total Platform Commission Fee Earned, Registered Shoppers, Active Merchants, Total Orders, and Live Catalog Size.
  - Pending vendor application alert banner with 1-click Approve / Reject actions.
  - Recharts 6-Month GMV vs. Platform Take Growth Chart.
  - Vendor sales distribution leaderboard.
- **Customer Accounts Directory:**
  - User profiles with avatars, contact information, lifetime spending, and total order counts.
  - Customer activity modal inspecting order history.
- **Vendor Directory & Approval Gate:**
  - Vendor applications ledger with status filters (`All`, `Pending`, `Approved`, `Suspended`).
  - Actions to Approve, Reject, or Suspend merchants.
  - Per-vendor custom commission rate configurator.
- **Global Product Catalog:**
  - Audit all 30+ products across all 5 vendors.
  - Filter by merchant store, department, or keyword.
  - 1-click "Featured" homepage badge toggle and administrative delete.
- **Global Order Registry:**
  - Master ledger of all orders across the entire marketplace.
  - Full order inspector modal with super-admin status override capabilities.
- **Commission & Fee Configuration:**
  - Configurable global platform commission rate percentage (default: 10%).
  - Store-by-store commission breakdown table showing gross sales, fee collected, and net payout.
- **Promotional Coupon Campaigns:**
  - Coupon manager (list, create, edit, delete, pause/resume).
  - Discount type (percentage or fixed amount), min order amount, max discount cap, and expiry date.
  - Live usage counter tracking redemptions.
- **Customer Review Moderation:**
  - Feed of all customer product reviews across the marketplace.
  - Actions to Mark Approved, Flag for Review, or permanently Delete inappropriate remarks.
- **Deep Analytics:**
  - Recharts Transaction Volume & Net Fee Scale.
  - Merchant Revenue Leaderboard.
  - Checkout Payment Rails Share (Card vs. UPI vs. Cash on Delivery).
  - Department catalog distribution.
- **Platform Architecture Settings:**
  - General branding: Platform name, currency symbol.
  - Checkout engine: Shipping fee ($15.00), Free shipping threshold ($100.00), Sales tax (5.0%).
  - Customer announcement banner text editor and active toggle.
  - Danger Zone: 1-click reset to clean demo seed state.

---

## 👥 Demo Accounts & Instant Role Switching

MarketHub includes pre-configured demo credentials and an **Omnipresent Role Switcher** available on every screen (navbar topbar, mobile header, and login page).

| Role | Demo Email | Simulated Password | Target Interface |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@markethub.com` | `customer123` | Customer Storefront (`/`) |
| **Vendor** | `vendor@markethub.com` | `vendor123` | TechPulse Official Dashboard (`/vendor`) |
| **Vendor (UrbanStyle)** | `urbanstyle@vendor.com` | `vendor123` | UrbanStyle Studio Dashboard (`/vendor`) |
| **Vendor (GlowBeauty)** | `glowbeauty@vendor.com` | `vendor123` | GlowBeauty Botanicals Dashboard (`/vendor`) |
| **Admin** | `admin@markethub.com` | `admin123` | Admin Control Panel (`/admin`) |

> **Pro Tip:** Use the **"Demo Role: [Role]"** button in the header at any time to instantly jump between the perspectives of Sarah (Customer), Alex (Vendor), and Eleanor (Admin) without re-logging!

---

## 📦 Realistic Seed Data Specifications

The prototype starts seeded with realistic, high-fidelity mock data saved in `localStorage`:
- **30 Products** spanning 8 categories with high-resolution Unsplash product imagery, pricing, discounts, stock levels, and technical specifications.
- **8 Departments:** Electronics, Fashion, Home & Kitchen, Beauty & Care, Sports & Fitness, Books & Learning, Accessories, Health & Wellness.
- **5 Independent Vendors:**
  1. *TechPulse Official* (Electronics, Approved, 10% rate)
  2. *UrbanStyle Studio* (Fashion, Approved, 12% rate)
  3. *HomeNest Living* (Home & Kitchen, Approved, 10% rate)
  4. *GlowBeauty Botanicals* (Beauty & Care, Approved, 10% rate)
  5. *ActiveGear Performance* (Sports, **Pending Approval** — ready for Admin approval testing!)
- **10 Customers** with complete address books and spend history.
- **15 Orders** across varied fulfillment stages (`Placed`, `Confirmed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`).
- **10 Verified Reviews** with star ratings and feedback.
- **5 Coupons:**
  - `WELCOME10`: 10% off orders over $50
  - `MEGA20`: 20% off orders over $200
  - `FESTIVE15`: 15% off orders over $75
  - `FREESHIP`: $15 off shipping fee
  - `TECHSAVE`: Flat $50 off technology purchases over $500

---

## 🛠️ Technology Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS (Navy Blue `#0f233a` primary, Vibrant Orange `#f97316` accent, Slate surfaces)
- **Routing:** React Router v6
- **State Management & Persistence:** Zustand with `persist` middleware (syncs to browser `localStorage`)
- **Visual Analytics:** Recharts (ResponsiveContainer, AreaChart, BarChart, Tooltip)
- **Icons:** Lucide React
- **Build Tool:** Vite 5 with Rollup code-splitting

---

## 🚀 Running the Project Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🧪 Testing the Core Multi-Vendor Workflows

1. **Customer Workflow:**
   - Browse the homepage, click on "Sony WH-1000XM5 Wireless Headphones".
   - View details, add quantity 1 to cart, click "Add to Cart".
   - Open Cart (`/cart`), enter coupon `WELCOME10`, observe the 10% discount and delivery fee calculation.
   - Click "Proceed to Checkout", select delivery address, select Credit Card or Cash on Delivery, click "Confirm & Place Order".
   - View Order Confirmation and click "Track Live Status" to see the shipment progress bar!

2. **Cross-Role Vendor Workflow:**
   - Use the Role Switcher in the topbar to jump to **Vendor View (TechPulse Official)**.
   - Notice the new order appears immediately in your **Orders** tab (`/vendor/orders`).
   - Advance the order status from `Placed` to `Processing` or `Shipped`.
   - Go to **Products** (`/vendor/products`), click "Add New Product", enter details and submit.
   - Switch back to **Customer View** and search for your newly added product — it is live in the customer storefront!

3. **Admin Workflow:**
   - Switch role to **Admin**.
   - Notice the yellow alert banner: *"1 Vendor Application Awaiting Admin Decision (ActiveGear Performance)"*.
   - Click **Approve** directly from the banner or in **Vendor Approvals** (`/admin/vendors`).
   - Go to **Commissions & Fees** (`/admin/commissions`), adjust the standard rate or a vendor's custom rate.
   - Go to **Global Orders** (`/admin/orders`), inspect any order and use the Super Admin status override.
   - Go to **Platform Settings** (`/admin/settings`), edit the announcement banner message — observe it update immediately across the customer website!
