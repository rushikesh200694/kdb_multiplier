import express from 'express';
import { loginAdmin, getMe, registerCustomer, loginCustomer } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', registerCustomer);
router.post('/customer/login', loginCustomer);
router.get('/me', protect, getMe);

export default router;
