import mongoose from 'mongoose';
import { makeFallbackModel } from './dbHelper.js';

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  productId: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const MongooseBanner = mongoose.model('Banner', BannerSchema);
const Banner = makeFallbackModel('banners', MongooseBanner);

export default Banner;
export { MongooseBanner };
