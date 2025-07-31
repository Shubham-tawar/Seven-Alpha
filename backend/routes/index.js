const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth');
const userRoutes = require('./users');
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');
const paymentRoutes = require('./payment');
const couponRoutes = require('./coupons');
const wishlistRoutes = require('./wishlist');
const adminRoutes = require('./adminRoutes');

/**
 * @route   GET /api
 * @desc    Root API route
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/payment', paymentRoutes);
router.use('/coupons', couponRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);

module.exports = router;