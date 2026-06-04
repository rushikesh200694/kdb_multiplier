import express from 'express';
import { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public route for homepage
router.get('/', getBanners);

// Admin routes
router.get('/admin', protect, getAllBanners);
router.post('/', protect, upload.single('image'), createBanner);
router.put('/:id', protect, upload.single('image'), updateBanner);
router.delete('/:id', protect, deleteBanner);

export default router;
