import express from 'express';
import { getVisits, getVisitById, createVisit, updateVisit, deleteVisit, addGalleryImage, removeGalleryImage } from '../controllers/visitController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getVisits);
router.get('/:id', getVisitById);
router.post('/', protect, upload.array('gallery', 10), createVisit);
router.put('/:id', protect, upload.array('gallery', 10), updateVisit);
router.delete('/:id', protect, deleteVisit);
router.post('/:id/gallery', protect, upload.array('gallery', 10), addGalleryImage);
router.delete('/:id/gallery/:imageId', protect, removeGalleryImage);

export default router;
