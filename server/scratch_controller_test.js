import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { registerCustomer, loginCustomer } from './controllers/authController.js';

dotenv.config({ path: './server/.env' });

// Mock Express req and res
const makeMockRes = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.jsonData = data;
    return res;
  };
  return res;
};

async function test() {
  const mongoUri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const testEmail = `cust_${Date.now()}@example.com`;
    const testPassword = 'mySecurePassword123';

    // Test 1: Register a new customer
    const req1 = {
      body: {
        name: 'New Farmer',
        email: testEmail,
        password: testPassword
      }
    };
    const res1 = makeMockRes();
    
    console.log('Running registerCustomer for a new email...');
    await registerCustomer(req1, res1);
    console.log('Response Status:', res1.statusCode);
    console.log('Response JSON:', res1.jsonData);

    // Test 2: Login the registered customer
    const req2 = {
      body: {
        email: testEmail,
        password: testPassword
      }
    };
    const res2 = makeMockRes();
    
    console.log('Running loginCustomer for the new email...');
    await loginCustomer(req2, res2);
    console.log('Response Status:', res2.statusCode);
    console.log('Response JSON:', res2.jsonData);

    // Clean up
    if (res1.jsonData && res1.jsonData.user) {
      await mongoose.model('User').deleteOne({ _id: res1.jsonData.user.id });
      console.log('Cleaned up test user.');
    }

  } catch (err) {
    console.error('Test threw error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
