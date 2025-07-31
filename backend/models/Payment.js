const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Can be null for guest checkouts
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentProvider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'INR'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending'
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  paymentDetails: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  refundDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refundTransactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billingEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billingPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billingName: {
    type: DataTypes.STRING,
    allowNull: true
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
  }
}, {
  timestamps: true
});

module.exports = Payment;