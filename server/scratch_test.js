import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './server/.env' });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

const MongooseUser = mongoose.model('User', UserSchema);

async function test() {
  const mongoUri = process.env.MONGODB_URI;
  console.log('Connecting to:', mongoUri);
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    // Let's list users
    const users = await MongooseUser.find({});
    console.log('Current users in DB:', users.map(u => ({ email: u.email, role: u.role, name: u.name })));

    // Try a test registration manually (with a unique email)
    const testEmail = `test_${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const newUser = await MongooseUser.create({
      name: 'Test Customer',
      email: testEmail,
      password: hashedPassword,
      role: 'customer'
    });
    console.log('Created user:', newUser);

    // Clean up
    await MongooseUser.deleteOne({ _id: newUser._id });
    console.log('Cleaned up test user.');
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
