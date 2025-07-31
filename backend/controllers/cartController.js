const { Cart, CartItem, Product, ProductVariant, Coupon } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id, status: 'active' },
      include: [
        {
          model: CartItem,
          include: [
            { model: Product },
            { model: ProductVariant }
          ]
        }
      ]
    });

    // If no cart exists, create one
    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        status: 'active'
      });
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
const addItemToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Validate product exists and is in stock
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if variant exists if provided
    let variant = null;
    if (variantId) {
      variant = await ProductVariant.findOne({
        where: { id: variantId, productId }
      });

      if (!variant) {
        return res.status(404).json({ message: 'Product variant not found' });
      }

      // Check if variant is in stock
      if (variant.countInStock < quantity) {
        return res.status(400).json({ message: 'Product variant is out of stock' });
      }
    } else {
      // Check if product is in stock
      if (product.countInStock < quantity) {
        return res.status(400).json({ message: 'Product is out of stock' });
      }
    }

    // Get or create cart
    let cart = await Cart.findOne({
      where: { userId: req.user.id, status: 'active' }
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        status: 'active'
      });
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null
      }
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += parseInt(quantity);
      existingItem.price = variant ? variant.price : product.price;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
      await existingItem.save();
    } else {
      // Create new cart item
      await CartItem.create({
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity: parseInt(quantity),
        price: variant ? variant.price : product.price,
        subtotal: (variant ? variant.price : product.price) * parseInt(quantity),
        attributes: req.body.attributes || {}
      });
    }

    // Recalculate cart totals
    await recalculateCart(cart.id);

    // Get updated cart with items
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          include: [
            { model: Product },
            { model: ProductVariant }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      cart: updatedCart,
      message: 'Item added to cart'
    });
  } catch (error) {
    console.error('Add item to cart error:', error);
    res.status(500).json({ message: 'Server error while adding item to cart' });
  }
};

/**
 * @desc    Update cart item
 * @route   PUT /api/cart/items/:id
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.id;

    // Find the cart item
    const cartItem = await CartItem.findByPk(itemId, {
      include: [{ model: Cart, where: { userId: req.user.id } }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check if product/variant is in stock
    if (cartItem.variantId) {
      const variant = await ProductVariant.findByPk(cartItem.variantId);
      if (variant.countInStock < quantity) {
        return res.status(400).json({ message: 'Product variant is out of stock' });
      }
    } else {
      const product = await Product.findByPk(cartItem.productId);
      if (product.countInStock < quantity) {
        return res.status(400).json({ message: 'Product is out of stock' });
      }
    }

    // Update quantity
    cartItem.quantity = parseInt(quantity);
    cartItem.subtotal = cartItem.price * cartItem.quantity;
    await cartItem.save();

    // Recalculate cart totals
    await recalculateCart(cartItem.cartId);

    // Get updated cart
    const updatedCart = await Cart.findByPk(cartItem.cartId, {
      include: [
        {
          model: CartItem,
          include: [
            { model: Product },
            { model: ProductVariant }
          ]
        }
      ]
    });

    res.json({
      success: true,
      cart: updatedCart,
      message: 'Cart item updated'
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error while updating cart item' });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:id
 * @access  Private
 */
const removeCartItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    // Find the cart item
    const cartItem = await CartItem.findByPk(itemId, {
      include: [{ model: Cart, where: { userId: req.user.id } }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const cartId = cartItem.cartId;

    // Delete the cart item
    await cartItem.destroy();

    // Recalculate cart totals
    await recalculateCart(cartId);

    // Get updated cart
    const updatedCart = await Cart.findByPk(cartId, {
      include: [
        {
          model: CartItem,
          include: [
            { model: Product },
            { model: ProductVariant }
          ]
        }
      ]
    });

    res.json({
      success: true,
      cart: updatedCart,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'Server error while removing cart item' });
  }
};

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res) => {
  try {
    // Find user's active cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id, status: 'active' }
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Delete all cart items
    await CartItem.destroy({ where: { cartId: cart.id } });

    // Reset cart totals
    cart.subtotal = 0;
    cart.taxAmount = 0;
    cart.shippingAmount = 0;
    cart.discountAmount = 0;
    cart.totalAmount = 0;
    cart.couponCode = null;
    cart.couponDetails = null;
    await cart.save();

    res.json({
      success: true,
      cart,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
};

/**
 * @desc    Apply coupon to cart
 * @route   POST /api/cart/coupon
 * @access  Private
 */
const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    // Find user's active cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id, status: 'active' },
      include: [{ model: CartItem }]
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if cart is empty
    if (cart.CartItems.length === 0) {
      return res.status(400).json({ message: 'Cannot apply coupon to empty cart' });
    }

    // Find valid coupon
    const coupon = await Coupon.findOne({
      where: {
        code,
        isActive: true,
        startDate: { [Op.lte]: new Date() },
        endDate: { [Op.gte]: new Date() },
        usedCount: { [Op.lt]: Sequelize.col('usageLimit') }
      }
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    // Check minimum spend
    if (coupon.minimumSpend && cart.subtotal < coupon.minimumSpend) {
      return res.status(400).json({
        message: `Minimum spend of $${coupon.minimumSpend} required for this coupon`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cart.subtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Apply maximum discount if set
    if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
      discountAmount = coupon.maximumDiscount;
    }

    // Update cart with coupon
    cart.couponCode = code;
    cart.couponDetails = {
      id: coupon.id,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount
    };
    cart.discountAmount = discountAmount;
    cart.totalAmount = cart.subtotal + cart.taxAmount + cart.shippingAmount - discountAmount;
    await cart.save();

    // Get updated cart with items
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          include: [
            { model: Product },
            { model: ProductVariant }
          ]
        }
      ]
    });

    res.json({
      success: true,
      cart: updatedCart,
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ message: 'Server error while applying coupon' });
  }
};

/**
 * @desc    Remove coupon from cart
 * @route   DELETE /api/cart/coupon
 * @access  Private
 */
const removeCoupon = async (req, res) => {
  try {
    // Find user's active cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id, status: 'active' }
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove coupon
    cart.couponCode = null;
    cart.couponDetails = null;
    cart.discountAmount = 0;
    cart.totalAmount = cart.subtotal + cart.taxAmount + cart.shippingAmount;
    await cart.save();

    // Get updated cart with items
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          include: [
            { model: Product },
            { model: ProductVariant }
          ]
        }
      ]
    });

    res.json({
      success: true,
      cart: updatedCart,
      message: 'Coupon removed successfully'
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({ message: 'Server error while removing coupon' });
  }
};

/**
 * Helper function to recalculate cart totals
 */
const recalculateCart = async (cartId) => {
  const cart = await Cart.findByPk(cartId, {
    include: [{ model: CartItem }]
  });

  if (!cart) return;

  // Calculate subtotal from items
  const subtotal = cart.CartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Set default values
  cart.subtotal = subtotal;
  
  // If there's a coupon, recalculate discount
  if (cart.couponCode && cart.couponDetails) {
    let discountAmount = 0;
    if (cart.couponDetails.discountType === 'percentage') {
      discountAmount = (subtotal * cart.couponDetails.discountValue) / 100;
    } else {
      discountAmount = cart.couponDetails.discountValue;
    }

    // Apply maximum discount if set
    if (cart.couponDetails.maximumDiscount && discountAmount > cart.couponDetails.maximumDiscount) {
      discountAmount = cart.couponDetails.maximumDiscount;
    }

    cart.discountAmount = discountAmount;
  }

  // Calculate total
  cart.totalAmount = cart.subtotal + cart.taxAmount + cart.shippingAmount - cart.discountAmount;
  
  await cart.save();
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon
};