import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

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
  try {
    await mongoose.connect(mongoUri);
    const user = await MongooseUser.findOne({ email: 'rushikesh200694@gmail.com' });
    console.log('User document:', user);
    
    // Try to compare password (let's assume they inputted some password, say they did Rushi@200694 or whatever)
    // Wait, let's check if the password field starts with $2a$ or similar (valid bcrypt hash)
    if (user) {
      const isValidBcrypt = user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'));
      console.log('Is password a valid bcrypt hash?', isValidBcrypt);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
