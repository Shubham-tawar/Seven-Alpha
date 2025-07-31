const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');

/**
 * @route   GET /api/cart
 * @desc    Get user cart
 * @access  Private
 */
router.get('/', protect, cartController.getCart);

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/', protect, cartController.addItemToCart);

/**
 * @route   PUT /api/cart/:id
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put('/:id', protect, cartController.updateCartItem);

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/:id', protect, cartController.removeCartItem);

/**
 * @route   DELETE /api/cart
 * @desc    Clear cart
 * @access  Private
 */
router.delete('/', protect, cartController.clearCart);

/**
 * @route   POST /api/cart/apply-coupon
 * @desc    Apply coupon to cart
 * @access  Private
 */
router.post('/apply-coupon', protect, cartController.applyCoupon);

/**
 * @route   DELETE /api/cart/remove-coupon
 * @desc    Remove coupon from cart
 * @access  Private
 */
router.delete('/remove-coupon', protect, cartController.removeCoupon);

module.exports = router;