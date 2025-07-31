const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/auth');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', categoryController.getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Create a category
 * @access  Private/Admin
 */
router.post('/', protect, admin, categoryController.createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, categoryController.deleteCategory);

/**
 * @route   GET /api/categories/:id/products
 * @desc    Get products by category
 * @access  Public
 */
router.get('/:id/products', categoryController.getProductsByCategory);

module.exports = router;