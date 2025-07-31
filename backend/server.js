const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const { testConnection } = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

// Import Passport config
require('./config/passport');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Special handling for Stripe webhook
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Regular body parsing for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Session configuration for Passport
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Test database connection
testConnection();

// Routes
app.use('/api', require('./routes/index'));

// Note: The following routes are already mounted in routes/index.js
// They are commented out here to avoid duplicate route definitions
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/categories', require('./routes/categories'));
// app.use('/api/orders', require('./routes/orders'));
// app.use('/api/cart', require('./routes/cart'));
// app.use('/api/payment', require('./routes/payment'));
// app.use('/api/coupons', require('./routes/coupons'));


// Error handler middleware
app.use(errorHandler);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;