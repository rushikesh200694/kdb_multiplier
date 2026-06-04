import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look up the admin user
    let user = await User.findOne({ email });

    // Seed admin if there are no users at all (or if the database is brand new)
    const count = await User.countDocuments();
    if (count === 0 || !user) {
      const defaultEmail = process.env.ADMIN_EMAIL || 'rushikeshpatil4850@gmail.com';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'Rushi@200694';

      if (email === defaultEmail) {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        user = await User.create({
          name: 'KBD Admin',
          email: defaultEmail,
          password: hashedPassword,
          role: 'admin'
        });
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Check if it's the raw unhashed env password (in case seeding was bypassed or fallback DB was refreshed)
      const defaultPassword = process.env.ADMIN_PASSWORD || 'Rushi@200694';
      if (password === defaultPassword && email === user.email) {
        // Allow login
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'supersecretkbdkeydhule2026',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving admin data', error: error.message });
  }
};

export const registerCustomer = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'customer'
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'supersecretkbdkeydhule2026',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

export const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'supersecretkbdkeydhule2026',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during customer login', error: error.message });
  }
};
