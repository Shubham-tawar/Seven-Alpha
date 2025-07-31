const { Wishlist, Product, ProductVariant } = require('../models');

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          include: [{ model: ProductVariant }]
        }
      ]
    });

    res.json({ success: true, wishlistItems });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
};

/**
 * @desc    Toggle product in wishlist (add if not exists, remove if exists)
 * @route   POST /api/wishlist/toggle/:productId
 * @access  Private
 */
const toggleWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Validate product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });

    let result;
    let action;

    if (existingItem) {
      // Remove from wishlist
      await existingItem.destroy();
      action = 'removed';
      result = { productId };
    } else {
      // Add to wishlist
      result = await Wishlist.create({
        userId: req.user.id,
        productId
      });
      action = 'added';
    }

    res.json({ 
      success: true, 
      action,
      wishlistItem: result
    });
  } catch (error) {
    console.error('Toggle wishlist item error:', error);
    res.status(500).json({ message: 'Server error while updating wishlist' });
  }
};

module.exports = {
  getWishlist,
  toggleWishlistItem
};