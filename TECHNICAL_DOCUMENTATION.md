# Technical Documentation - KBD Multiplier

This document outlines the technical architecture, setup instructions, and API references for the KBD Multiplier platform.

## 🛠 Technology Stack
* **Frontend:** React.js (via Vite), TailwindCSS, Framer Motion, React Router DOM
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (JSON Web Tokens)
* **File Storage:** Local uploads (Multer) or Cloudinary (via multer-storage-cloudinary)

## 📁 Architecture & Folder Structure
The project is organized into a monorepo-style structure separating the client and server code.

### Client (`/client`)
Built with Vite and React.
* `src/api/`: Axios interceptors and API endpoint wrappers (`productAPI`, `visitAPI`, etc.)
* `src/components/`: Reusable UI components.
* `src/pages/`: Customer-facing pages (Home, Products, Cart) and Admin pages (`/admin/*`).
* `src/context/`: React context providers (e.g., CartContext, AuthContext).

### Server (`/server`)
Built with Node.js and Express.
* `models/`: Mongoose schemas (Product, Visit, Review, User, Order, Banner).
* `controllers/`: Business logic for handling API requests.
* `routes/`: Express route definitions connecting endpoints to controllers.
* `middleware/`: Authentication and file upload middlewares (`auth.js`, `upload.js`).

## 🚀 Local Setup & Installation

### Prerequisites
* Node.js (v16+)
* MongoDB instance (local or Atlas)

### Backend Setup
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `server` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Start the development server: `npm run dev`

### Frontend Setup
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. The application will be available at `http://localhost:5173`.

## 🗄️ Database Schema Overview

* **Product:** Stores name, category, dynamic pricing (by weight/unit), description, and images.
* **Visit:** Stores title, location, date, description, and an array of gallery images.
* **Review:** Stores visitor details, rating, text, and an approval status flag.
* **Order:** Stores customer details, purchased items, total amount, and status (`pending`, `confirmed`, `delivered`).
* **User (Admin):** Stores credentials for accessing the admin panel.

## 📡 Core API Endpoints

### Products (`/api/products`)
* `GET /` - Retrieve all products
* `GET /:id` - Retrieve a specific product
* `POST /` - Create a product (Protected)
* `PUT /:id` - Update a product (Protected)

### Visits (`/api/visits`)
* `GET /` - Retrieve all visits
* `POST /` - Create a visit (Protected)
* `POST /:id/gallery` - Append images to a visit's gallery (Protected)
* `DELETE /:id/gallery/:imgId` - Remove an image from a gallery (Protected)

### Orders (`/api/orders`)
* `GET /` - Retrieve all orders (Protected)
* `POST /` - Place a new order
* `PUT /:id/status` - Update an order's status (Protected)

### Auth (`/api/auth`)
* `POST /login` - Admin authentication
* `POST /customer/login` - Customer authentication
* `GET /me` - Retrieve current user profile (Protected)
