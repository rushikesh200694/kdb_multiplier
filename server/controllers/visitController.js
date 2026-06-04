import Visit from '../models/Visit.js';

export const getVisits = async (req, res) => {
  try {
    const visits = await Visit.find({});
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving visits', error: error.message });
  }
};

export const getVisitById = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving visit details', error: error.message });
  }
};

export const createVisit = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;

    let gallery = [];
    if (req.files && req.files.length > 0) {
      gallery = req.files.map(file => file.path);
    } else if (req.body.gallery) {
      gallery = typeof req.body.gallery === 'string' ? JSON.parse(req.body.gallery) : req.body.gallery;
    }

    const visit = await Visit.create({
      title,
      description,
      location,
      date: date || new Date().toISOString().split('T')[0],
      gallery
    });

    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Error creating visit', error: error.message });
  }
};

export const updateVisit = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    let gallery = visit.gallery;
    if (req.files && req.files.length > 0) {
      gallery = req.files.map(file => file.path);
    } else if (req.body.gallery) {
      gallery = typeof req.body.gallery === 'string' ? JSON.parse(req.body.gallery) : req.body.gallery;
    }

    const updatedVisit = await Visit.findByIdAndUpdate(
      req.params.id,
      {
        title: title || visit.title,
        description: description || visit.description,
        location: location || visit.location,
        date: date || visit.date,
        gallery
      },
      { new: true }
    );

    res.json(updatedVisit);
  } catch (error) {
    res.status(500).json({ message: 'Error updating visit', error: error.message });
  }
};

export const deleteVisit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    await Visit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Visit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting visit', error: error.message });
  }
};

export const addGalleryImage = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }

    const newImages = req.files.map(file => file.path);
    const updatedGallery = [...visit.gallery, ...newImages];

    const updatedVisit = await Visit.findByIdAndUpdate(
      req.params.id,
      { gallery: updatedGallery },
      { new: true }
    );

    res.json(updatedVisit);
  } catch (error) {
    res.status(500).json({ message: 'Error adding gallery image', error: error.message });
  }
};

export const removeGalleryImage = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    const { imageId } = req.params;
    let updatedGallery = [];

    if (!isNaN(imageId)) {
      const idx = parseInt(imageId);
      updatedGallery = visit.gallery.filter((_, index) => index !== idx);
    } else {
      const decodedImg = decodeURIComponent(imageId);
      updatedGallery = visit.gallery.filter(img => !img.includes(decodedImg) && img !== decodedImg);
    }

    const updatedVisit = await Visit.findByIdAndUpdate(
      req.params.id,
      { gallery: updatedGallery },
      { new: true }
    );

    res.json(updatedVisit);
  } catch (error) {
    res.status(500).json({ message: 'Error removing gallery image', error: error.message });
  }
};
