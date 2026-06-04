import express from 'express';
import { getReviews, createReview, approveReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', upload.array('photos', 5), createReview);
router.put('/:id/approve', protect, approveReview);
router.delete('/:id', protect, deleteReview);

export default router;
