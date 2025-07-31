const { Coupon, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all coupons
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
const getCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: coupons } = await Coupon.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      coupons
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: 'Server error while fetching coupons' });
  }
};

/**
 * @desc    Get coupon by ID
 * @route   GET /api/coupons/:id
 * @access  Private/Admin
 */
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ success: true, coupon });
  } catch (error) {
    console.error('Get coupon by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching coupon' });
  }
};

/**
 * @desc    Create a coupon
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumSpend,
      maximumDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit,
      usageLimitPerUser,
      applicableProducts,
      excludedProducts,
      applicableCategories,
      excludedCategories,
      firstTimeCustomersOnly,
      individualUse
    } = req.body;

    // Validate required fields
    if (!code || !discountType || !discountValue) {
      return res.status(400).json({
        message: 'Code, discount type, and discount value are required'
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ where: { code } });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Validate discount type
    if (!['percentage', 'fixed'].includes(discountType)) {
      return res.status(400).json({
        message: 'Discount type must be either percentage or fixed'
      });
    }

    // Validate discount value
    if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({
        message: 'Percentage discount must be between 0 and 100'
      });
    }

    if (discountType === 'fixed' && discountValue <= 0) {
      return res.status(400).json({
        message: 'Fixed discount must be greater than 0'
      });
    }

    // Create coupon
    const coupon = await Coupon.create({
      code,
      description,
      discountType,
      discountValue,
      minimumSpend,
      maximumDiscount,
      startDate: startDate || new Date(),
      endDate,
      isActive: isActive !== undefined ? isActive : true,
      usageLimit,
      usageLimitPerUser,
      usedCount: 0,
      applicableProducts,
      excludedProducts,
      applicableCategories,
      excludedCategories,
      firstTimeCustomersOnly: firstTimeCustomersOnly || false,
      individualUse: individualUse || false
    });

    res.status(201).json({
      success: true,
      coupon,
      message: 'Coupon created successfully'
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Server error while creating coupon' });
  }
};

/**
 * @desc    Update a coupon
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minimumSpend,
      maximumDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit,
      usageLimitPerUser,
      applicableProducts,
      excludedProducts,
      applicableCategories,
      excludedCategories,
      firstTimeCustomersOnly,
      individualUse
    } = req.body;

    // Check if coupon code already exists if changing
    if (code && code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ where: { code } });
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
    }

    // Validate discount type if changing
    if (discountType && !['percentage', 'fixed'].includes(discountType)) {
      return res.status(400).json({
        message: 'Discount type must be either percentage or fixed'
      });
    }

    // Validate discount value if changing
    if (discountType === 'percentage' && discountValue !== undefined && 
        (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({
        message: 'Percentage discount must be between 0 and 100'
      });
    }

    if (discountType === 'fixed' && discountValue !== undefined && discountValue <= 0) {
      return res.status(400).json({
        message: 'Fixed discount must be greater than 0'
      });
    }

    // Update coupon fields
    coupon.code = code || coupon.code;
    coupon.description = description !== undefined ? description : coupon.description;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue !== undefined ? discountValue : coupon.discountValue;
    coupon.minimumSpend = minimumSpend !== undefined ? minimumSpend : coupon.minimumSpend;
    coupon.maximumDiscount = maximumDiscount !== undefined ? maximumDiscount : coupon.maximumDiscount;
    coupon.startDate = startDate || coupon.startDate;
    coupon.endDate = endDate !== undefined ? endDate : coupon.endDate;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
    coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
    coupon.usageLimitPerUser = usageLimitPerUser !== undefined ? usageLimitPerUser : coupon.usageLimitPerUser;
    coupon.applicableProducts = applicableProducts !== undefined ? applicableProducts : coupon.applicableProducts;
    coupon.excludedProducts = excludedProducts !== undefined ? excludedProducts : coupon.excludedProducts;
    coupon.applicableCategories = applicableCategories !== undefined ? applicableCategories : coupon.applicableCategories;
    coupon.excludedCategories = excludedCategories !== undefined ? excludedCategories : coupon.excludedCategories;
    coupon.firstTimeCustomersOnly = firstTimeCustomersOnly !== undefined ? firstTimeCustomersOnly : coupon.firstTimeCustomersOnly;
    coupon.individualUse = individualUse !== undefined ? individualUse : coupon.individualUse;

    await coupon.save();

    res.json({
      success: true,
      coupon,
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ message: 'Server error while updating coupon' });
  }
};

/**
 * @desc    Delete a coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await coupon.destroy();

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Server error while deleting coupon' });
  }
};

/**
 * @desc    Validate a coupon
 * @route   POST /api/coupons/validate
 * @access  Private
 */
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    // Find valid coupon
    const coupon = await Coupon.findOne({
      where: {
        code,
        isActive: true,
        startDate: { [Op.lte]: new Date() },
        endDate: { [Op.or]: [{ [Op.gte]: new Date() }, { [Op.is]: null }]}
      }
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    // Check minimum spend
    if (coupon.minimumSpend && cartTotal < coupon.minimumSpend) {
      return res.status(400).json({
        message: `Minimum spend of $${coupon.minimumSpend} required for this coupon`
      });
    }

    // Check if first-time customer only
    if (coupon.firstTimeCustomersOnly) {
      // Check if user has any orders
      const userOrderCount = await Order.count({ where: { userId: req.user.id } });
      if (userOrderCount > 0) {
        return res.status(400).json({ message: 'Coupon is for first-time customers only' });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Apply maximum discount if set
    if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
      discountAmount = coupon.maximumDiscount;
    }

    res.json({
      success: true,
      coupon: {
        ...coupon.toJSON(),
        discountAmount
      },
      message: 'Coupon is valid'
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Server error while validating coupon' });
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};