const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Order, User, OrderItem, Address } = require('../models');
const { Op } = require('sequelize');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

/**
 * @desc    Get Stripe publishable key
 * @route   GET /api/payment/config
 * @access  Private
 */
const getStripeConfig = async (req, res) => {
  try {
    res.json({
      success: true,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (error) {
    console.error('Get Stripe config error:', error);
    res.status(500).json({ message: 'Server error while getting payment configuration' });
  }
};

/**
 * @desc    Create payment intent
 * @route   POST /api/payment/create-payment-intent
 * @access  Private
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Get order details
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: req.user.id,
        orderNumber: order.orderNumber
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error while creating payment intent' });
  }
};

/**
 * @desc    Handle Stripe webhook
 * @route   POST /api/payment/webhook
 * @access  Public
 */
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature with raw body
    // Note: req.body is raw buffer when hitting this endpoint due to express.raw middleware
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

/**
 * @desc    Get payment by ID
 * @route   GET /api/payment/:id
 * @access  Private
 */
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Order }, { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }]
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if payment belongs to user or user is admin
    if (payment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Get payment by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching payment' });
  }
};

/**
 * @desc    Get all payments (admin)
 * @route   GET /api/payment/admin
 * @access  Private/Admin
 */
const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    // Build query conditions
    const whereConditions = {};
    if (status) {
      whereConditions.status = status;
    }

    const { count, rows: payments } = await Payment.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [['paymentDate', 'DESC']],
      include: [
        { model: Order },
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      payments
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ message: 'Server error while fetching payments' });
  }
};

/**
 * @desc    Get user payments
 * @route   GET /api/payment/user
 * @access  Private
 */
const getUserPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: payments } = await Payment.findAndCountAll({
      where: { userId: req.user.id },
      limit,
      offset,
      order: [['paymentDate', 'DESC']],
      include: [{ model: Order }]
    });

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      payments
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ message: 'Server error while fetching user payments' });
  }
};

/**
 * Helper function to handle successful payment
 */
const handleSuccessfulPayment = async (paymentIntent) => {
  try {
    const { orderId, userId } = paymentIntent.metadata;

    if (!orderId) {
      console.error('No order ID in payment metadata');
      return;
    }

    // Update order payment status
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return;
    }

    order.paymentStatus = 'paid';
    order.paymentDetails = {
      paymentIntentId: paymentIntent.id,
      paymentMethod: paymentIntent.payment_method,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      paymentDate: new Date()
    };

    // Update order status if needed
    if (order.status === 'pending') {
      order.status = 'processing';
    }

    await order.save();

    // Create payment record
    await Payment.create({
      orderId,
      userId,
      transactionId: paymentIntent.id,
      paymentMethod: 'stripe',
      paymentProvider: 'stripe',
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      status: 'completed',
      paymentDate: new Date(),
      paymentDetails: {
        paymentIntentId: paymentIntent.id,
        paymentMethodType: paymentIntent.payment_method_types[0],
        chargeId: paymentIntent.latest_charge,
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
      },
      billingAddressId: order.billingAddressId
    });

    // Send order confirmation email
    try {
      // Get user details
      const user = await User.findByPk(userId);
      
      // Get order items
      const orderItems = await OrderItem.findAll({
        where: { orderId },
        include: [{ all: true }]
      });
      
      // Get shipping and billing addresses
      const shippingAddress = await Address.findByPk(order.shippingAddressId);
      const billingAddress = await Address.findByPk(order.billingAddressId);
      
      // Format order items for email
      const formattedOrderItems = orderItems.map(item => ({
        name: item.Product ? item.Product.name : item.productName,
        variantName: item.ProductVariant ? item.ProductVariant.name : item.variantName,
        quantity: item.quantity,
        price: item.price
      }));
      
      // Send the confirmation email
      await sendOrderConfirmationEmail({
        user,
        order,
        orderItems: formattedOrderItems,
        shippingAddress,
        billingAddress
      });
    } catch (emailError) {
      // Log error but don't fail the payment process
      console.error('Error sending order confirmation email:', emailError);
    }

    console.log(`Payment for order ${orderId} processed successfully`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

/**
 * Helper function to handle failed payment
 */
const handleFailedPayment = async (paymentIntent) => {
  try {
    const { orderId } = paymentIntent.metadata;

    if (!orderId) {
      console.error('No order ID in payment metadata');
      return;
    }

    // Update order payment status
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return;
    }

    order.paymentStatus = 'failed';
    order.paymentDetails = {
      paymentIntentId: paymentIntent.id,
      paymentMethod: paymentIntent.payment_method,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      failureMessage: paymentIntent.last_payment_error?.message,
      failureDate: new Date()
    };

    await order.save();

    console.log(`Payment for order ${orderId} failed`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

module.exports = {
  getStripeConfig,
  createPaymentIntent,
  handleStripeWebhook,
  getPaymentById,
  getAllPayments,
  getUserPayments
};