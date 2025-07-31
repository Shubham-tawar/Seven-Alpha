const User = require('./User');
const Address = require('./Address');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const Category = require('./Category');
const Review = require('./Review');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Coupon = require('./Coupon');
const Payment = require('./Payment');
const Wishlist = require('./Wishlist');

// Define relationships

// User relationships
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' });
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlistItems' });

// Address relationships
Address.belongsTo(User, { foreignKey: 'userId' });
Address.hasMany(Order, { foreignKey: 'shippingAddressId', as: 'shippingOrders' });
Address.hasMany(Order, { foreignKey: 'billingAddressId', as: 'billingOrders' });
Address.hasMany(Cart, { foreignKey: 'shippingAddressId', as: 'shippingCarts' });
Address.hasMany(Cart, { foreignKey: 'billingAddressId', as: 'billingCarts' });

// Category relationships
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

// Product relationships
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlistedBy' });

// ProductVariant relationships
ProductVariant.belongsTo(Product, { foreignKey: 'productId' });
ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId', as: 'orderItems' });
ProductVariant.hasMany(CartItem, { foreignKey: 'variantId', as: 'cartItems' });

// Review relationships
Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Product, { foreignKey: 'productId' });
Review.hasOne(OrderItem, { foreignKey: 'reviewId' });

// Order relationships
Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Address, { foreignKey: 'shippingAddressId', as: 'shippingAddress' });
Order.belongsTo(Address, { foreignKey: 'billingAddressId', as: 'billingAddress' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Order.hasOne(Cart, { foreignKey: 'convertedToOrderId', as: 'originatingCart' });

// OrderItem relationships
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId' });
OrderItem.belongsTo(Review, { foreignKey: 'reviewId' });

// Cart relationships
Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsTo(Address, { foreignKey: 'shippingAddressId', as: 'shippingAddress' });
Cart.belongsTo(Address, { foreignKey: 'billingAddressId', as: 'billingAddress' });
Cart.belongsTo(Order, { foreignKey: 'convertedToOrderId', as: 'resultingOrder' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });

// CartItem relationships
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId' });

// Payment relationships
Payment.belongsTo(Order, { foreignKey: 'orderId' });
Payment.belongsTo(User, { foreignKey: 'userId' });
Payment.belongsTo(Address, { foreignKey: 'billingAddressId', as: 'billingAddress' });

// Wishlist relationships
Wishlist.belongsTo(User, { foreignKey: 'userId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  User,
  Address,
  Product,
  ProductVariant,
  Category,
  Review,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Coupon,
  Payment,
  Wishlist
};