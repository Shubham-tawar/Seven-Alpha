const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Can be null for guest carts
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true // For guest users
  },
  status: {
    type: DataTypes.ENUM('active', 'merged', 'converted', 'abandoned'),
    defaultValue: 'active'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  shippingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  couponDetails: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  shippingAddressId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Addresses',
      key: 'id'
    }
  },
  billingAddressId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Addresses',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  convertedToOrderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  lastActivity: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: (cart) => {
      // Update lastActivity timestamp
      cart.lastActivity = new Date();
      
      // Calculate total
      cart.totalAmount = parseFloat(cart.subtotal) + 
                         parseFloat(cart.taxAmount) + 
                         parseFloat(cart.shippingAmount) - 
                         parseFloat(cart.discountAmount);
    }
  }
});

module.exports = Cart;