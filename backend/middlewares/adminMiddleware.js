const { User } = require('../models');

/**
 * Admin middleware
 * Verifies that the user is an admin
 * This middleware should be used after the auth middleware
 */
const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists and is an admin
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error in admin authorization' });
  }
};

module.exports = { isAdmin };