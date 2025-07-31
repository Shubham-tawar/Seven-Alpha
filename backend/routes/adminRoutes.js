const express = require('express');
const router = express.Router();

// Import controllers
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');

// Import middleware
const { protect } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/adminMiddleware');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard data
 * @access  Private/Admin
 */
router.get('/dashboard', protect, isAdmin, async (req, res) => {
  try {
    // This is a placeholder for dashboard data
    // In a real implementation, you would fetch actual statistics
    res.json({
      success: true,
      dashboardData: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        topSellingProducts: []
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// Product Management Routes
/**
 * @route   GET /api/admin/products
 * @desc    Get all products (including hidden)
 * @access  Private/Admin
 */
router.get('/products', protect, isAdmin, productController.getProducts);

/**
 * @route   POST /api/admin/products
 * @desc    Create a product
 * @access  Private/Admin
 */
router.post('/products', protect, isAdmin, productController.createProduct);

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update a product
 * @access  Private/Admin
 */
router.put('/products/:id', protect, isAdmin, productController.updateProduct);

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete a product
 * @access  Private/Admin
 */
router.delete('/products/:id', protect, isAdmin, productController.deleteProduct);

/**
 * @route   PUT /api/admin/products/:id/toggle-visibility
 * @desc    Toggle product visibility
 * @access  Private/Admin
 */
router.put('/products/:id/toggle-visibility', protect, isAdmin, productController.toggleProductVisibility);

// User Management Routes
/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/users', protect, isAdmin, userController.getUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/users/:id', protect, isAdmin, userController.getUserById);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
router.put('/users/:id', protect, isAdmin, userController.updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/users/:id', protect, isAdmin, userController.deleteUser);

// Order Management Routes
/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
router.get('/orders', protect, isAdmin, orderController.getAllOrders);

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get order by ID
 * @access  Private/Admin
 */
router.get('/orders/:id', protect, isAdmin, orderController.getOrderById);

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
router.put('/orders/:id/status', protect, isAdmin, orderController.updateOrderStatus);

/**
 * @route   PUT /api/admin/orders/:id/deliver
 * @desc    Update order to delivered
 * @access  Private/Admin
 */
router.put('/orders/:id/deliver', protect, isAdmin, orderController.updateOrderDeliveryStatus);

/**
 * @route   GET /api/admin/orders/stats
 * @desc    Get order statistics
 * @access  Private/Admin
 */
router.get('/orders/stats', protect, isAdmin, orderController.getOrderStats);

module.exports = router;