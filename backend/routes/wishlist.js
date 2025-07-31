const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middlewares/auth');

/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
router.get('/', protect, wishlistController.getWishlist);

/**
 * @route   POST /api/wishlist/toggle/:productId
 * @desc    Toggle product in wishlist (add/remove)
 * @access  Private
 */
router.post('/toggle/:productId', protect, wishlistController.toggleWishlistItem);

module.exports = router;