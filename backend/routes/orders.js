const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/auth');

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 */
router.post('/', protect, orderController.createOrder);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get logged in user orders
 * @access  Private
 */
router.get('/my-orders', protect, orderController.getUserOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', protect, orderController.getOrderById);

/**
 * @route   PUT /api/orders/:id/pay
 * @desc    Update order to paid
 * @access  Private
 */
router.put('/:id/pay', protect, orderController.updateOrderPaymentStatus);

/**
 * @route   PUT /api/orders/:id/deliver
 * @desc    Update order to delivered
 * @access  Private/Admin
 */
router.put('/:id/deliver', protect, admin, orderController.updateOrderDeliveryStatus);

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
router.get('/', protect, admin, orderController.getAllOrders);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel an order
 * @access  Private
 */
router.put('/:id/cancel', protect, orderController.cancelOrder);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 * @access  Private/Admin
 */
router.get('/stats', protect, admin, orderController.getOrderStats);

module.exports = router;