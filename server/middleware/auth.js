import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer')) {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkbdkeydhule2026');
      req.user = decoded;
      next();
    } else {
      res.status(401).json({ message: 'Not authorized, no token provided' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
