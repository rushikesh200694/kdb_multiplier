import mongoose from 'mongoose';
import { makeFallbackModel } from './dbHelper.js';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: false },
  address: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'] }
}, { timestamps: true });

const MongooseOrder = mongoose.model('Order', OrderSchema);
const Order = makeFallbackModel('orders', MongooseOrder);

export default Order;
export { MongooseOrder };
