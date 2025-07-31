const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middlewares/auth');

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, sorting, and pagination
 * @access  Public
 */
router.get('/', productController.getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a product
 * @access  Private/Admin
 */
router.post('/', protect, admin, productController.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, productController.deleteProduct);

/**
 * @route   PUT /api/products/:id/toggle-visibility
 * @desc    Toggle product visibility (show/hide)
 * @access  Private/Admin
 */
router.put('/:id/toggle-visibility', protect, admin, productController.toggleProductVisibility);

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Create new review
 * @access  Private
 */
router.post('/:id/reviews', protect, productController.createProductReview);

/**
 * @route   GET /api/products/:id/reviews
 * @desc    Get product reviews
 * @access  Public
 */
router.get('/:id/reviews', productController.getProductReviews);

/**
 * @route   DELETE /api/products/:id/reviews/:reviewId
 * @desc    Delete product review
 * @access  Private
 */
router.delete('/:id/reviews/:reviewId', protect, productController.deleteProductReview);

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @route   GET /api/products/new-arrivals
 * @desc    Get new arrival products
 * @access  Public
 */
router.get('/new-arrivals', productController.getNewArrivals);

module.exports = router;