import mongoose from 'mongoose';

let cached = global._mongoConnection || null;

export let useFallback = false;

export const connectDB = async () => {
  if (cached && mongoose.connection.readyState === 1) {
    return cached;
  }

  try {
    mongoose.set('strictQuery', false);
    // Accept both MONGO_URI and MONGODB_URI
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/kbd-multiplier';
    console.log('Attempting to connect to MongoDB...');

    cached = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    global._mongoConnection = cached;
    console.log(`MongoDB Connected: ${cached.connection.host}`);
    useFallback = false;
    return cached;
  } catch (error) {
    console.warn(`MongoDB Connection Failed: ${error.message}`);
    useFallback = true;
    throw error;
  }
};

export const getFallbackState = () => useFallback;
export const setFallbackState = (state) => { useFallback = state; };
