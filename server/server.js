import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import visitRoutes from './routes/visitRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { seedDatabase } from './utils/seeder.js';
import bannerRoutes from './routes/bannerRoutes.js';
import compression from 'compression';

dotenv.config();

const app = express();

// Middleware
app.use(compression());
app.use(cors({
  origin: '*', // In development, allow access from any origin
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const __dirname = path.resolve();
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Static folders
app.use('/uploads', express.static(uploadPath));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('KBD Multiplier Dhule API is running...');
});

const PORT = process.env.PORT || 5000;

// Connect to DB (with automatic JSON file database fallback)
connectDB().then(() => {
  // Seed DB with default admin and mock agricultural data in development
  if (process.env.NODE_ENV !== 'production') {
    seedDatabase();
  }
}).catch(console.error);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in development mode`);
  });
}

export default app;
