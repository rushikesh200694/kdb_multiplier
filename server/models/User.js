import mongoose from 'mongoose';
import { makeFallbackModel } from './dbHelper.js';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

const MongooseUser = mongoose.model('User', UserSchema);
const User = makeFallbackModel('users', MongooseUser);

export default User;
export { MongooseUser };
