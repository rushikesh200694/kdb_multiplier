import Review from '../models/Review.js';

export const getReviews = async (req, res) => {
  try {
    // If request contains admin = true in query, return all reviews. Otherwise only approved ones.
    const isAdmin = req.query.admin === 'true';
    
    let query = { isApproved: true };
    if (isAdmin) {
      query = {}; // Admin can see all reviews (pending and approved)
    }

    const reviews = await Review.find(query);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, visitorName, rating, reviewText } = req.body;

    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map(file => file.path);
    } else if (req.body.photos) {
      photos = typeof req.body.photos === 'string' ? JSON.parse(req.body.photos) : req.body.photos;
    }

    let visitorPhoto = '';
    if (req.body.visitorPhoto) {
      visitorPhoto = req.body.visitorPhoto;
    }

    const review = await Review.create({
      productId: productId || null,
      visitorName,
      visitorPhoto,
      rating: Number(rating),
      reviewText,
      photos,
      isApproved: false // Requires admin approval
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error approving review', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};
