import Banner from '../models/Banner.js';

// Public: get only active banners sorted by order
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving banners', error: error.message });
  }
};

// Admin: get all banners regardless of active state
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving banners', error: error.message });
  }
};

// Admin: create a new banner
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, description, productId, isActive, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let image = '';
    if (req.file) {
      image = req.file.path; // Cloudinary URL
    } else if (req.body.image) {
      image = req.body.image;
    }

    const banner = await Banner.create({
      title,
      subtitle: subtitle ?? '',
      description: description || '',
      image,
      productId: productId || null,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
      order: order ? parseInt(order) : 0
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error('Banner creation error:', error);
    res.status(500).json({ message: 'Error creating banner', error: error.message });
  }
};

// Admin: update a banner
export const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, description, productId, isActive, order } = req.body;
    const existing = await Banner.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Banner not found' });

    let image = existing.image;
    if (req.file) {
      image = req.file.path; // new Cloudinary URL
    } else if (req.body.image) {
      image = req.body.image;
    }

    const updated = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title: title || existing.title,
        subtitle: subtitle !== undefined ? subtitle : existing.subtitle,
        description: description !== undefined ? description : existing.description,
        image,
        productId: productId !== undefined ? (productId || null) : existing.productId,
        isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existing.isActive,
        order: order !== undefined ? parseInt(order) : existing.order
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Banner update error:', error);
    res.status(500).json({ message: 'Error updating banner', error: error.message });
  }
};

// Admin: delete a banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error: error.message });
  }
};
