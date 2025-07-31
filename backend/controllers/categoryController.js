const { Category, Product } = require('../models');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
      include: [{ model: Category, as: 'subcategories', where: { isActive: true }, required: false }]
    });

    res.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Category, as: 'subcategories', where: { isActive: true }, required: false }]
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ success: true, category });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching category' });
  }
};

/**
 * @desc    Create a category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      slug,
      parentId,
      image,
      isActive,
      displayOrder,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;

    // Check if slug already exists
    if (slug) {
      const slugExists = await Category.findOne({ where: { slug } });
      if (slugExists) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
    }

    // Check if parent category exists if provided
    if (parentId) {
      const parentExists = await Category.findByPk(parentId);
      if (!parentExists) {
        return res.status(400).json({ message: 'Parent category not found' });
      }
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      slug,
      parentId,
      image,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
      metaTitle,
      metaDescription,
      metaKeywords
    });

    res.status(201).json({
      success: true,
      category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error while creating category' });
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const {
      name,
      description,
      slug,
      parentId,
      image,
      isActive,
      displayOrder,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;

    // Check if slug already exists if changing
    if (slug && slug !== category.slug) {
      const slugExists = await Category.findOne({ where: { slug } });
      if (slugExists) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
    }

    // Check if parent category exists if changing
    if (parentId && parentId !== category.parentId) {
      // Prevent setting parent to self
      if (parentId === category.id) {
        return res.status(400).json({ message: 'Category cannot be its own parent' });
      }

      const parentExists = await Category.findByPk(parentId);
      if (!parentExists) {
        return res.status(400).json({ message: 'Parent category not found' });
      }

      // Prevent circular references
      let currentParent = parentExists;
      while (currentParent.parentId) {
        if (currentParent.parentId === category.id) {
          return res.status(400).json({ message: 'Circular reference detected' });
        }
        currentParent = await Category.findByPk(currentParent.parentId);
      }
    }

    // Update category fields
    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.slug = slug || category.slug;
    category.parentId = parentId !== undefined ? parentId : category.parentId;
    category.image = image !== undefined ? image : category.image;
    category.isActive = isActive !== undefined ? isActive : category.isActive;
    category.displayOrder = displayOrder !== undefined ? displayOrder : category.displayOrder;
    category.metaTitle = metaTitle !== undefined ? metaTitle : category.metaTitle;
    category.metaDescription = metaDescription !== undefined ? metaDescription : category.metaDescription;
    category.metaKeywords = metaKeywords !== undefined ? metaKeywords : category.metaKeywords;

    await category.save();

    res.json({
      success: true,
      category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error while updating category' });
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has subcategories
    const subcategories = await Category.findAll({ where: { parentId: category.id } });
    if (subcategories.length > 0) {
      return res.status(400).json({ message: 'Cannot delete category with subcategories' });
    }

    // Check if category has products
    const products = await Product.findAll({ where: { categoryId: category.id } });
    if (products.length > 0) {
      return res.status(400).json({ message: 'Cannot delete category with products' });
    }

    await category.destroy();

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error while deleting category' });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/categories/:id/products
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get all subcategory IDs
    const subcategories = await Category.findAll({ where: { parentId: category.id } });
    const categoryIds = [category.id, ...subcategories.map(subcat => subcat.id)];

    // Get products from this category and its subcategories
    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        categoryId: categoryIds,
        isActive: true
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Server error while fetching products by category' });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory
};