const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, admin } = require('../middlewares/auth');

/**
 * @route   POST /api/payment/create-payment-intent
 * @desc    Create payment intent
 * @access  Private
 */
router.post('/create-payment-intent', protect, paymentController.createPaymentIntent);

/**
 * @route   POST /api/payment/create-session
 * @desc    Create checkout session
 * @access  Private
 */
router.post('/create-session', protect, paymentController.createPaymentIntent);

/**
 * @route   POST /api/payment/webhook
 * @desc    Stripe webhook
 * @access  Public
 */
router.post('/webhook', paymentController.handleStripeWebhook);

/**
 * @route   GET /api/payment/config
 * @desc    Get Stripe publishable key
 * @access  Public
 */
router.get('/config', paymentController.getStripeConfig);

/**
 * @route   GET /api/payment/transactions
 * @desc    Get payment transactions
 * @access  Private/Admin
 */
router.get('/transactions', protect, admin, paymentController.getAllPayments);

/**
 * @route   GET /api/payment/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private/Admin
 */
router.get('/transactions/:id', protect, admin, paymentController.getPaymentById);

/**
 * @route   GET /api/payment/my-payments
 * @desc    Get user's payment transactions
 * @access  Private
 */
router.get('/my-payments', protect, paymentController.getUserPayments);

module.exports = router;