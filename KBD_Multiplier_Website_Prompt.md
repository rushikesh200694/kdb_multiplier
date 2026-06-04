# E-Commerce Website Prompt - KBD Multiplier Dhule

## Project Overview
Build a complete e-commerce website for selling farm products including multilayers, Ayurvedic medicine, soap, and other agricultural products. The website should be modern, responsive, and include both customer-facing pages and an admin panel.

---

## 1. Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla or React)
- **Backend:** Node.js with Express (or Python Django/Flask)
- **Database:** MongoDB (recommended) or MySQL
- **Authentication:** JWT-based auth for admin
- **File Storage:** Local storage or cloud (AWS S3/Cloudinary)

---

## 2. Folder Structure

```
kbd-multiplier-website/
├── public/
│   ├── images/
│   │   ├── products/
│   │   ├── banners/
│   │   ├── visits/
│   │   ├── reviews/
│   │   └── logo/
│   ├── css/
│   │   ├── style.css
│   │   ├── responsive.css
│   │   └── admin.css
│   ├── js/
│   │   ├── main.js
│   │   ├── admin.js
│   │   └── cart.js
│   └── uploads/
├── src/
│   ├── models/
│   │   ├── Product.js
│   │   ├── Visit.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── visitRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── authRoutes.js
│   │   └── orderRoutes.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── visitController.js
│   │   ├── reviewController.js
│   │   ├── authController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js
│   └── config/
│       └── db.js
├── views/
│   ├── index.html
│   ├── product-detail.html
│   ├── cart.html
│   ├── checkout.html
│   ├── login.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── products.html
│   │   ├── visits.html
│   │   ├── reviews.html
│   │   └── orders.html
├── server.js
├── package.json
└── README.md
```

---

## 3. Color Scheme

### Primary Colors
- **Primary Green:** `#2E7D32` (Forest Green - represents farm/nature)
- **Primary Dark:** `#1B5E20` (Dark Green)
- **Primary Light:** `#4CAF50` (Light Green)

### Secondary Colors
- **Accent Orange:** `#FF8F00` (Amber - for buttons, CTAs)
- **Accent Light:** `#FFB300` (Golden)

### Neutral Colors
- **Background:** `#FAFAFA` (Off-white)
- **Card Background:** `#FFFFFF` (White)
- **Text Primary:** `#212121` (Near Black)
- **Text Secondary:** `#757575` (Gray)
- **Border:** `#E0E0E0` (Light Gray)

### Special Colors
- **Success:** `#4CAF50`
- **Error:** `#F44336`
- **Warning:** `#FF9800`

---

## 4. Customer-Facing Pages

### 4.1 Home Page (index.html)

#### Top Navigation Bar
- **Logo:** Left side - "KBD Multiplier Dhule" text logo
- **Search Bar:** Center - with search icon, placeholder "Search products..."
- **Nav Components (Right side):**
  - Home
  - Products
  - Visits
  - Reviews
  - Contact Us
- **Icons:**
  - Cart icon with item count badge
  - Login icon (only shows when ordering)

#### Hero Section
- **Banner Slider:** 6-8 product banners (provided by user)
- **Auto-change:** Every 2.5 seconds
- **Navigation:** Arrow buttons on sides, dots indicator below
- **Shop Now Button:** Centered below banner

#### Products Section
- **Title:** "Our Products"
- **Grid Layout:**
  - Desktop: 4 columns × 2 rows = 8 products
  - Mobile: 2 columns × 8 rows = 16 products
- **Product Card:**
  - Product image
  - Product name
  - Short description (50 words max)
  - Price range
  - "Add to Cart" button
- **View More Button:** Below grid, loads more products

#### Company Visits Section
- **Title:** "Our Visits"
- **Grid Layout:** Same 4×2 (desktop) / 2×8 (mobile)
- **Visit Card:**
  - Location image
  - Visit title/description
  - Date
  - "View Details" button

#### Reviews Section
- **Title:** "Customer Reviews"
- **Layout:** 4 review cards in a row
- **Review Card:**
  - Reviewer photo (thumbnail, circular)
  - Reviewer name
  - Rating (stars)
  - Review text (short)
  - Multiple product photos (thumbnails)

#### Footer
- **Left Side:**
  - Company Name: "KBD Multiplier Dhule"
  - Address: [Your address]
- **Right Side:**
  - Social Media Icons (Facebook, Instagram, WhatsApp)
  - Email: [your email]
  - Phone: [your phone]
- **Bottom:** Copyright text

---

### 4.2 Product Detail Page (product-detail.html)

#### Product Gallery
- **Main Image:** Large display image
- **Thumbnail Gallery:** Multiple images below
- **Visit Location:** If product is from a visit, show location thumbnail

#### Product Information
- **Product Name:** Large heading
- **Price:** Dynamic based on quantity/weight
- **Quantity Selector:** Dropdown or input for weight/qty
- **Price Calculator:** Shows price for selected quantity
- **Description 1 (Short):** 50-100 words with price and add to cart
- **Description 2 (Long):** 100-500 words detailed description

#### Add to Cart Section
- Quantity/Weight selector
- Unit options (kg, g, piece, etc.)
- Price display (updates with quantity)
- "Add to Cart" button
- "Buy Now" button (requires login)

#### Reviews Section
- Product-specific reviews
- Average rating display
- Review form for customers

---

### 4.3 Cart Page (cart.html)
- List of added products
- Quantity adjustment
- Price calculation
- Remove item option
- Proceed to Checkout (requires login)

---

### 4.4 Checkout Page (checkout.html)
- **Login Required:** Prompt to login if not authenticated
- **Form Fields:**
  - Name
  - Address
  - Phone
  - Payment method
- Order summary
- Place Order button

---

### 4.5 Customer Review Form
- Star rating selector
- Review text area
- Photo upload (multiple)
- Submit button

---

## 5. Admin Panel

### 5.1 Login Page (login.html)
- **Email:** rushikeshpatil4850@gmail.com
- **Password:** Rushi@200694
- Login button
- Error messages for invalid credentials

### 5.2 Dashboard (dashboard.html)
- Overview statistics
- Quick links to sections
- Recent orders
- Recent reviews

### 5.3 Products Management (products.html)
- **List View:** All products with search/filter
- **Add Product Form:**
  - Product name
  - Category (multilayer, Ayurvedic medicine, soap, etc.)
  - Short description
  - Long description
  - Price configuration (per weight/qty)
  - Multiple images upload
  - Visit association (optional)
- **Actions:** Add, Edit, Delete, Update

### 5.4 Visits Management (visits.html)
- **List View:** All visits
- **Add Visit Form:**
  - Visit title
  - Location description
  - Date
  - Multiple gallery images
- **Actions:** Add, Edit, Delete, Update, Manage Gallery

### 5.5 Reviews Management (reviews.html)
- **List View:** All reviews
- **Actions:** View, Delete, Approve/Reject
- Customer review form management

### 5.6 Orders Management (orders.html)
- Order list
- Order status update
- Customer details

---

## 6. Database Schema

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  category: String, // multilayer, ayurvedic, soap, etc.
  shortDescription: String,
  longDescription: String,
  images: [String],
  prices: [{
    quantity: Number,
    unit: String, // kg, g, piece
    price: Number
  }],
  visitId: ObjectId (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Visit
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  location: String,
  date: Date,
  gallery: [String],
  createdAt: Date
}
```

### Review
```javascript
{
  _id: ObjectId,
  productId: ObjectId (optional),
  visitorName: String,
  visitorPhoto: String,
  rating: Number,
  reviewText: String,
  photos: [String],
  isApproved: Boolean,
  createdAt: Date
}
```

### User (Admin)
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  role: String // admin
}
```

### Order
```javascript
{
  _id: ObjectId,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  address: String,
  items: [{
    productId: ObjectId,
    quantity: Number,
    unit: String,
    price: Number
  }],
  totalAmount: Number,
  status: String, // pending, confirmed, shipped, delivered
  createdAt: Date
}
```

---

## 7. API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Visits
- `GET /api/visits` - Get all visits
- `GET /api/visits/:id` - Get single visit
- `POST /api/visits` - Create visit (admin)
- `PUT /api/visits/:id` - Update visit (admin)
- `DELETE /api/visits/:id` - Delete visit (admin)
- `POST /api/visits/:id/gallery` - Add gallery image (admin)
- `DELETE /api/visits/:id/gallery/:imageId` - Remove gallery image (admin)

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review (customer)
- `PUT /api/reviews/:id/approve` - Approve review (admin)
- `DELETE /api/reviews/:id` - Delete review (admin)

### Auth
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin)

---

## 8. Key Features Summary

### Customer Features
- [ ] Browse products without login
- [ ] Search products
- [ ] View product details
- [ ] See different prices for different quantities
- [ ] Add to cart
- [ ] Login only for checkout
- [ ] View company visits
- [ ] Read and submit reviews
- [ ] View visit gallery

### Admin Features
- [ ] Secure login
- [ ] Add/Edit/Delete products
- [ ] Set price according to weight/quantity
- [ ] Manage visit gallery (add/remove/update)
- [ ] Manage reviews (delete, approve)
- [ ] View and manage orders

### Technical Features
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Hero banner auto-slider (2.5 sec)
- [ ] Image gallery for products and visits
- [ ] Search functionality
- [ ] Cart functionality
- [ ] Form validation

---

## 9. Implementation Priority

1. **Phase 1 - Basic Structure**
   - Folder structure
   - HTML templates
   - Basic CSS styling

2. **Phase 2 - Frontend**
   - Home page with all sections
   - Product listing and detail pages
   - Responsive design
   - Hero slider

3. **Phase 3 - Backend**
   - Server setup
   - Database connection
   - API endpoints

4. **Phase 4 - Admin Panel**
   - Login system
   - Product management
   - Visit management
   - Review management

5. **Phase 5 - Polish**
   - Animations
   - Form validation
   - Error handling
   - Testing

---

## 10. Notes

- All images should be optimized for web
- Use lazy loading for images
- Implement proper error handling
- Add loading states for async operations
- Ensure mobile-first approach
- Use semantic HTML
- Follow accessibility guidelines