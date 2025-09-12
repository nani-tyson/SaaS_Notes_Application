// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authMiddleware = (req, res, next) => {
  // Get the complete header value
  const authHeader = req.header('Authorization');

  // Check if the header exists and is in the correct format ('Bearer <token>')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token or invalid format, authorization denied' });
  }

  try {
    // Extract the token from the header (split by space and take the second part)
    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const adminMiddleware = (req, res, next) => {
    // We assume this middleware runs *after* the authMiddleware,
    // so req.user will be populated.
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Forbidden: Admin access required' });
    }
    next();
};

export default authMiddleware;