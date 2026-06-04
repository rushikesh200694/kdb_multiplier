import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const DATA_DIR = path.join(__dirname, 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json');

// Initialize folder and JSON file if not exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(JSON_DB_PATH)) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify({
    products: [],
    visits: [],
    reviews: [],
    orders: [],
    users: []
  }, null, 2));
}

export let useFallback = false;

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kbd-multiplier';
    console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);
    
    // Quick timeout to fallback fast if mongo is not running
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000 
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    useFallback = false;
  } catch (error) {
    console.warn(`MongoDB Connection Failed: ${error.message}`);
    console.warn(`>>> FALLING BACK TO LOCAL FILE SYSTEM DATABASE: ${JSON_DB_PATH} <<<`);
    useFallback = true;
  }
};

export const getFallbackState = () => useFallback;
export const setFallbackState = (state) => { useFallback = state; };
export { JSON_DB_PATH };
