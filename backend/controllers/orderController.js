const { Order, OrderItem, Cart, CartItem, Product, ProductVariant, Address, User, Payment } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const {
      shippingAddressId,
      billingAddressId,
      paymentMethod,
      notes
    } = req.body;

    // Validate addresses
    if (!shippingAddressId) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const shippingAddress = await Address.findOne({
      where: { id: shippingAddressId, userId: req.user.id }
    });

    if (!shippingAddress) {
      return res.status(404).json({ message: 'Shipping address not found' });
    }

    // If billing address is not provided, use shipping address
    let billingAddressToUse = billingAddressId;
    if (billingAddressId) {
      const billingAddress = await Address.findOne({
        where: { id: billingAddressId, userId: req.user.id }
      });

      if (!billingAddress) {
        return res.status(404).json({ message: 'Billing address not found' });
      }
    } else {
      billingAddressToUse = shippingAddressId;
    }

    // Get user's active cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id, status: 'active' },
      include: [{
        model: CartItem,
        include: [
          { model: Product },
          { model: ProductVariant }
        ]
      }]
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check if all items are in stock
    for (const item of cart.CartItems) {
      if (item.variantId) {
        const variant = await ProductVariant.findByPk(item.variantId);
        if (!variant || variant.countInStock < item.quantity) {
          return res.status(400).json({
            message: `${item.Product.name} (${variant.name}) is out of stock`
          });
        }
      } else {
        const product = await Product.findByPk(item.productId);
        if (!product || product.countInStock < item.quantity) {
          return res.status(400).json({
            message: `${item.Product.name} is out of stock`
          });
        }
      }
    }

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      orderDate: new Date(),
      status: 'pending',
      shippingAddressId,
      billingAddressId: billingAddressToUse,
      paymentMethod,
      paymentStatus: 'pending',
      subtotal: cart.subtotal,
      taxAmount: cart.taxAmount,
      shippingAmount: cart.shippingAmount,
      discountAmount: cart.discountAmount,
      totalAmount: cart.totalAmount,
      couponCode: cart.couponCode,
      notes
    });

    // Create order items
    for (const item of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.Product.name,
        sku: item.variantId ? item.ProductVariant.sku : item.Product.sku,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        discount: 0, // Individual item discount if any
        tax: 0, // Individual item tax if any
        total: item.subtotal,
        image: item.variantId && item.ProductVariant.images.length > 0 ?
          item.ProductVariant.images[0] :
          (item.Product.images.length > 0 ? item.Product.images[0] : null),
        attributes: item.attributes
      });

      // Update product/variant stock
      if (item.variantId) {
        const variant = await ProductVariant.findByPk(item.variantId);
        variant.countInStock -= item.quantity;
        await variant.save();
      } else {
        const product = await Product.findByPk(item.productId);
        product.countInStock -= item.quantity;
        await product.save();
      }
    }

    // Update cart status to converted
    cart.status = 'converted';
    cart.convertedToOrderId = order.id;
    await cart.save();

    // Clear cart items (optional, depending on your business logic)
    // await CartItem.destroy({ where: { cartId: cart.id } });

    // Get complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem },
        { model: Address, as: 'shippingAddress' },
        { model: Address, as: 'billingAddress' }
      ]
    });

    res.status(201).json({
      success: true,
      order: completeOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};

/**
 * @desc    Get user orders
 * @route   GET /api/orders
 * @access  Private
 */
const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { userId: req.user.id },
      limit,
      offset,
      order: [['orderDate', 'DESC']],
      include: [{ model: OrderItem }]
    });

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem },
        { model: Address, as: 'shippingAddress' },
        { model: Address, as: 'billingAddress' },
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Payment }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the user or if the user is an admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

/**
 * @desc    Update order payment status
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
const updateOrderPaymentStatus = async (req, res) => {
  try {
    const { paymentDetails } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the user
    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update order payment status
    order.paymentStatus = 'paid';
    order.paymentDetails = paymentDetails;
    await order.save();

    // Create payment record
    await Payment.create({
      orderId: order.id,
      userId: req.user.id,
      transactionId: paymentDetails.transactionId,
      paymentMethod: order.paymentMethod,
      paymentProvider: paymentDetails.provider,
      amount: order.totalAmount,
      currency: paymentDetails.currency || 'USD',
      status: 'completed',
      paymentDate: new Date(),
      paymentDetails,
      billingAddressId: order.billingAddressId
    });

    // Update order status if needed
    if (order.status === 'pending') {
      order.status = 'processing';
      await order.save();
    }

    res.json({
      success: true,
      message: 'Order payment status updated',
      order
    });
  } catch (error) {
    console.error('Update order payment status error:', error);
    res.status(500).json({ message: 'Server error while updating payment status' });
  }
};

/**
 * @desc    Update order delivery status
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
const updateOrderDeliveryStatus = async (req, res) => {
  try {
    const { trackingNumber, shippingCarrier, estimatedDeliveryDate } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order delivery details
    order.status = 'shipped';
    order.trackingNumber = trackingNumber;
    order.shippingCarrier = shippingCarrier;
    order.estimatedDeliveryDate = estimatedDeliveryDate;
    order.shippedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Order marked as shipped',
      order
    });
  } catch (error) {
    console.error('Update order delivery status error:', error);
    res.status(500).json({ message: 'Server error while updating delivery status' });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the user or if the user is an admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled because it is already ${order.status}`
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellationReason = cancellationReason;
    order.cancelledAt = new Date();
    await order.save();

    // Restore product stock
    for (const item of order.OrderItems) {
      if (item.variantId) {
        const variant = await ProductVariant.findByPk(item.variantId);
        if (variant) {
          variant.countInStock += item.quantity;
          await variant.save();
        }
      } else {
        const product = await Product.findByPk(item.productId);
        if (product) {
          product.countInStock += item.quantity;
          await product.save();
        }
      }
    }

    // Process refund if payment was made
    if (order.paymentStatus === 'paid') {
      // In a real application, you would integrate with your payment provider here
      // For now, we'll just update the status
      order.paymentStatus = 'refunded';
      order.refundedAt = new Date();
      order.refundAmount = order.totalAmount;
      order.refundReason = cancellationReason;
      await order.save();

      // Update payment record if exists
      const payment = await Payment.findOne({ where: { orderId: order.id } });
      if (payment) {
        payment.status = 'refunded';
        payment.refundAmount = order.totalAmount;
        payment.refundDate = new Date();
        payment.refundReason = cancellationReason;
        await payment.save();
      }
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error while cancelling order' });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    // Update status
    order.status = status;
    if (notes) order.notes = notes;

    // Update timestamps based on status
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
};

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders/admin
 * @access  Private/Admin
 */
const getAllOrders = async (req, res) => {
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

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [['orderDate', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: OrderItem }
      ]
    });

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

/**
 * @desc    Get order statistics
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
const getOrderStats = async (req, res) => {
  try {
    // Get total orders count
    const totalOrders = await Order.count();

    // Get orders by status
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Get total revenue
    const totalRevenue = await Order.sum('totalAmount', {
      where: { paymentStatus: 'paid' }
    });

    // Get recent orders
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['orderDate', 'DESC']],
      include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }]
    });

    // Get monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', 'month', Sequelize.col('orderDate')), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'revenue']
      ],
      where: {
        orderDate: { [Op.gte]: sixMonthsAgo },
        paymentStatus: 'paid'
      },
      group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('orderDate'))],
      order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('orderDate')), 'ASC']]
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        ordersByStatus,
        totalRevenue,
        recentOrders,
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error while fetching order statistics' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderPaymentStatus,
  updateOrderDeliveryStatus,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderStats
};