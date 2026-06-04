import mongoose from 'mongoose';
import { makeFallbackModel } from './dbHelper.js';

const VisitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  gallery: [{ type: String }],
  date: { type: String, required: true } // Date as String for easy form submission
}, { timestamps: true });

const MongooseVisit = mongoose.model('Visit', VisitSchema);
const Visit = makeFallbackModel('visits', MongooseVisit);

export default Visit;
export { MongooseVisit };
