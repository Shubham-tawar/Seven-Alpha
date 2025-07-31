const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middlewares/auth');

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', protect, admin, userController.getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/:id', protect, admin, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, userController.deleteUser);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, userController.updateProfile);

/**
 * @route   GET /api/users/addresses
 * @desc    Get user addresses
 * @access  Private
 */
router.get('/addresses', protect, userController.getUserAddresses);

/**
 * @route   POST /api/users/addresses
 * @desc    Add new address
 * @access  Private
 */
router.post('/addresses', protect, userController.addUserAddress);

/**
 * @route   PUT /api/users/addresses/:id
 * @desc    Update address
 * @access  Private
 */
router.put('/addresses/:id', protect, userController.updateUserAddress);

/**
 * @route   DELETE /api/users/addresses/:id
 * @desc    Delete address
 * @access  Private
 */
router.delete('/addresses/:id', protect, userController.deleteUserAddress);

module.exports = router;