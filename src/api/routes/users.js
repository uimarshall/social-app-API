const express = require('express');

const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getUserDetails,
  updateProfile,
  getAllUsers,
} = require('../controllers/userAuthController');
const { isAuthenticated } = require('../middlewares/auth');

// Create/Register user
router.post('/register', registerUser);

// Get all users - only admin can do this
router.get('/', isAuthenticated, getAllUsers);

// Login user
router.post('/login', loginUser);

// Logout user
router.get('/logout', logoutUser);

// Currently Login user-details or profile
router.get('/me', isAuthenticated, getUserProfile);

// Get single user details -
router.get('/:id', isAuthenticated, getUserDetails);

// Update user profile or details
router.put('/me/update', isAuthenticated, updateProfile);

module.exports = router;
