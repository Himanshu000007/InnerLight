import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * 
 * This middleware protects routes that require authentication.
 * 
 * How it works:
 * 1. Extracts JWT token from Authorization header
 * 2. Verifies the token using JWT_SECRET
 * 3. Finds the user from the token payload
 * 4. Attaches user to req.user for use in controllers
 * 
 * Usage in routes:
 * router.get('/protected-route', auth, controllerFunction);
 */
export const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided. Access denied.' 
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({ 
        message: 'Token missing. Access denied.' 
      });
    }

    // Verify token
    // jwt.verify() throws error if token is invalid/expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from token payload (decoded contains userId)
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: 'User not found. Token invalid.' 
      });
    }

    // Attach user to request object
    // Now controllers can access req.user
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please login again.' 
      });
    }
    res.status(500).json({ 
      message: 'Authentication error', 
      error: error.message 
    });
  }
};
