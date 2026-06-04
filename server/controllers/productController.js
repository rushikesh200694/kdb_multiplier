import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product details', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, shortDescription, longDescription, prices, visitId } = req.body;
    
    // Parse prices if they were sent as stringified JSON (common in multipart forms)
    let parsedPrices = prices;
    if (typeof prices === 'string') {
      parsedPrices = JSON.parse(prices);
    }

    // Get uploaded file paths
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path); // Use file.path for Cloudinary full URL
    } else if (req.body.images) {
      images = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
    }

    const product = await Product.create({
      name,
      category,
      shortDescription,
      longDescription,
      prices: parsedPrices,
      images,
      visitId: visitId || null
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, category, shortDescription, longDescription, prices, visitId } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let parsedPrices = prices;
    if (typeof prices === 'string') {
      parsedPrices = JSON.parse(prices);
    }

    let images = product.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path); // Use file.path for Cloudinary full URL
    } else if (req.body.images) {
      images = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        category: category || product.category,
        shortDescription: shortDescription || product.shortDescription,
        longDescription: longDescription || product.longDescription,
        prices: parsedPrices || product.prices,
        images,
        visitId: visitId !== undefined ? visitId : product.visitId
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
