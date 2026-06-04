import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected before handling any API request
let dbReady = false;
let dbPromise = null;

const ensureDB = async (req, res, next) => {
  if (dbReady) return next();
  try {
    if (!dbPromise) {
      dbPromise = connectDB().then(async () => {
        await seedDatabase();
        dbReady = true;
      });
    }
    await dbPromise;
    next();
  } catch (error) {
    console.error('DB connection failed:', error.message);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
};

app.use('/api', ensureDB);

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

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in development mode`);
  });
}

export default app;
