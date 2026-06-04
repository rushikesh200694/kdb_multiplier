import mongoose from 'mongoose';
import { makeFallbackModel } from './dbHelper.js';

const PriceSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }, // kg, g, piece, litre etc.
  price: { type: Number, required: true }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  images: [{ type: String }],
  prices: [PriceSchema],
  visitId: { type: String, default: null }, // Using String to accommodate fallback IDs easily
  ratings: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 }
}, { timestamps: true });

const MongooseProduct = mongoose.model('Product', ProductSchema);
const Product = makeFallbackModel('products', MongooseProduct);

export default Product;
export { MongooseProduct };
