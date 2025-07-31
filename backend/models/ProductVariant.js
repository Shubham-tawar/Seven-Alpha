const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attributes: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
    // Example: { color: 'Red', size: 'XL' }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
    // If null, use product price
  },
  compareAtPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  countInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  dimensions: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = ProductVariant;