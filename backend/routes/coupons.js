const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth');
const {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} = require('../controllers/couponController');

// Admin routes
router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.route('/:id')
  .get(protect, admin, getCouponById)
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

// Public/User routes
router.post('/validate', protect, validateCoupon);

module.exports = router;