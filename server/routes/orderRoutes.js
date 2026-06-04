import express from 'express';
import { createOrder, getOrders, updateOrderStatus, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// More specific routes first
router.post('/', createOrder);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/status', protect, updateOrderStatus);

// General route last
router.get('/', protect, getOrders);

export default router;
