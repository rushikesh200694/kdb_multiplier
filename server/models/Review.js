import mongoose from 'mongoose';
import { makeFallbackModel } from './dbHelper.js';

const ReviewSchema = new mongoose.Schema({
  productId: { type: String, default: null }, // Optional product-specific review
  visitorName: { type: String, required: true },
  visitorPhoto: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  photos: [{ type: String }],
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

const MongooseReview = mongoose.model('Review', ReviewSchema);
const Review = makeFallbackModel('reviews', MongooseReview);

export default Review;
export { MongooseReview };
