import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, upload.array('images', 10), createProduct);
router.put('/:id', protect, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
