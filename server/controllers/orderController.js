import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, address, items, totalAmount } = req.body;

    if (!customerName || !customerPhone || !address || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      customerEmail,
      address,
      items,
      totalAmount,
      status: 'Pending'
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    // Handle sorting manually if we're using fallback
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Confirmed', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Not authorized, user email missing' });
    }
    const orders = await Order.find({ customerEmail: req.user.email });
    // Sort by creation date descending
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving your orders', error: error.message });
  }
};
