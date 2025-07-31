const { Op } = require('sequelize');
const { Product, Category, Review, ProductVariant, User } = require('../models');

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    const whereConditions = { isActive: true };
    
    // Only admins can see hidden products
    if (!req.user || req.user.role !== 'admin') {
      whereConditions.isHidden = false;
    }
    
    // Search by keyword
    if (req.query.keyword) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.keyword}%` } },
        { description: { [Op.iLike]: `%${req.query.keyword}%` } }
      ];
    }
    
    // Filter by category
    if (req.query.category) {
      whereConditions.categoryId = req.query.category;
    }
    
    // Filter by price range
    if (req.query.minPrice && req.query.maxPrice) {
      whereConditions.price = {
        [Op.between]: [parseFloat(req.query.minPrice), parseFloat(req.query.maxPrice)]
      };
    } else if (req.query.minPrice) {
      whereConditions.price = { [Op.gte]: parseFloat(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      whereConditions.price = { [Op.lte]: parseFloat(req.query.maxPrice) };
    }
    
    // Filter by brand
    if (req.query.brand) {
      whereConditions.brand = req.query.brand;
    }
    
    // Filter by rating
    if (req.query.rating) {
      whereConditions.rating = { [Op.gte]: parseFloat(req.query.rating) };
    }
    
    // Determine sort order
    let order = [];
    switch (req.query.sort) {
      case 'price-asc':
        order = [['price', 'ASC']];
        break;
      case 'price-desc':
        order = [['price', 'DESC']];
        break;
      case 'newest':
        order = [['createdAt', 'DESC']];
        break;
      case 'rating':
        order = [['rating', 'DESC']];
        break;
      case 'popularity':
        order = [['numReviews', 'DESC']];
        break;
      default:
        order = [['createdAt', 'DESC']];
    }
    
    // Get products with pagination
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order,
      include: [
        { model: Category, attributes: ['id', 'name', 'slug'] },
        { model: ProductVariant, as: 'variants' }
      ]
    });
    
    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'name', 'slug'] },
        { model: ProductVariant, as: 'variants' },
        {
          model: Review,
          as: 'reviews',
          include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'avatar'] }]
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      costPrice,
      sku,
      categoryId,
      brand,
      images,
      countInStock,
      isFeatured,
      weight,
      dimensions,
      tags,
      attributes,
      metaTitle,
      metaDescription,
      metaKeywords,
      variants
    } = req.body;
    
    // Check if category exists
    const categoryExists = await Category.findByPk(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    
    // Check if SKU already exists
    const skuExists = await Product.findOne({ where: { sku } });
    if (skuExists) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    
    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      compareAtPrice,
      costPrice,
      sku,
      categoryId,
      brand,
      images: images || [],
      countInStock,
      isFeatured: isFeatured || false,
      weight,
      dimensions,
      tags: tags || [],
      attributes: attributes || {},
      metaTitle,
      metaDescription,
      metaKeywords
    });
    
    // Create variants if provided
    if (variants && variants.length > 0) {
      const productVariants = variants.map(variant => ({
        ...variant,
        productId: product.id
      }));
      
      await ProductVariant.bulkCreate(productVariants);
    }
    
    // Get the created product with variants
    const createdProduct = await Product.findByPk(product.id, {
      include: [{ model: ProductVariant, as: 'variants' }]
    });
    
    res.status(201).json({
      success: true,
      product: createdProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const {
      name,
      description,
      price,
      compareAtPrice,
      costPrice,
      sku,
      categoryId,
      brand,
      images,
      countInStock,
      isFeatured,
      isActive,
      weight,
      dimensions,
      tags,
      attributes,
      metaTitle,
      metaDescription,
      metaKeywords,
      variants
    } = req.body;
    
    // Check if category exists if changing
    if (categoryId && categoryId !== product.categoryId) {
      const categoryExists = await Category.findByPk(categoryId);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }
    
    // Check if SKU already exists if changing
    if (sku && sku !== product.sku) {
      const skuExists = await Product.findOne({ where: { sku } });
      if (skuExists) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }
    
    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.compareAtPrice = compareAtPrice !== undefined ? compareAtPrice : product.compareAtPrice;
    product.costPrice = costPrice !== undefined ? costPrice : product.costPrice;
    product.sku = sku || product.sku;
    product.categoryId = categoryId || product.categoryId;
    product.brand = brand || product.brand;
    product.images = images || product.images;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    product.weight = weight !== undefined ? weight : product.weight;
    product.dimensions = dimensions || product.dimensions;
    product.tags = tags || product.tags;
    product.attributes = attributes || product.attributes;
    product.metaTitle = metaTitle || product.metaTitle;
    product.metaDescription = metaDescription || product.metaDescription;
    product.metaKeywords = metaKeywords || product.metaKeywords;
    
    await product.save();
    
    // Update variants if provided
    if (variants && variants.length > 0) {
      // Delete existing variants
      await ProductVariant.destroy({ where: { productId: product.id } });
      
      // Create new variants
      const productVariants = variants.map(variant => ({
        ...variant,
        productId: product.id
      }));
      
      await ProductVariant.bulkCreate(productVariants);
    }
    
    // Get the updated product with variants
    const updatedProduct = await Product.findByPk(product.id, {
      include: [{ model: ProductVariant, as: 'variants' }]
    });
    
    res.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.destroy();
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

/**
 * @desc    Create new review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
const createProductReview = async (req, res) => {
  try {
    const { rating, title, comment, images } = req.body;
    
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      where: {
        productId: req.params.id,
        userId: req.user.id
      }
    });
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    // Create review
    const review = await Review.create({
      productId: req.params.id,
      userId: req.user.id,
      rating: Number(rating),
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: false // This would be set based on order history
    });
    
    // Update product rating
    const productReviews = await Review.findAll({
      where: { productId: req.params.id }
    });
    
    product.numReviews = productReviews.length;
    product.rating = productReviews.reduce((acc, item) => item.rating + acc, 0) / productReviews.length;
    
    await product.save();
    
    res.status(201).json({
      success: true,
      review,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Create product review error:', error);
    res.status(500).json({ message: 'Server error while creating review' });
  }
};

/**
 * @desc    Get product reviews
 * @route   GET /api/products/:id/reviews
 * @access  Public
 */
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.id },
      include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

/**
 * @desc    Delete product review
 * @route   DELETE /api/products/:id/reviews/:reviewId
 * @access  Private
 */
const deleteProductReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.reviewId,
        productId: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await review.destroy();
    
    // Update product rating
    const product = await Product.findByPk(req.params.id);
    const productReviews = await Review.findAll({
      where: { productId: req.params.id }
    });
    
    if (productReviews.length > 0) {
      product.numReviews = productReviews.length;
      product.rating = productReviews.reduce((acc, item) => item.rating + acc, 0) / productReviews.length;
    } else {
      product.numReviews = 0;
      product.rating = 0;
    }
    
    await product.save();
    
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete product review error:', error);
    res.status(500).json({ message: 'Server error while deleting review' });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.findAll({
      where: { isFeatured: true, isActive: true },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }]
    });
    
    res.json({ success: true, products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error while fetching featured products' });
  }
};

/**
 * @desc    Get new arrival products
 * @route   GET /api/products/new-arrivals
 * @access  Public
 */
const getNewArrivals = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.findAll({
      where: { isActive: true },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }]
    });
    
    res.json({ success: true, products });
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({ message: 'Server error while fetching new arrivals' });
  }
};

/**
 * @desc    Toggle product visibility
 * @route   PUT /api/products/:id/toggle-visibility
 * @access  Private/Admin
 */
const toggleProductVisibility = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Toggle isHidden status
    product.isHidden = !product.isHidden;
    await product.save();
    
    res.json({
      success: true,
      message: `Product is now ${product.isHidden ? 'hidden' : 'visible'}`,
      isHidden: product.isHidden
    });
  } catch (error) {
    console.error('Toggle product visibility error:', error);
    res.status(500).json({ message: 'Server error while toggling product visibility' });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  createProductReview,
  getProductReviews,
  deleteProductReview,
  getFeaturedProducts,
  getNewArrivals,
  toggleProductVisibility
};