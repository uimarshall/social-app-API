const express = require('express');

const router = express.Router();

const {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getUserDetails,
  updateProfile,
} = require('../controllers/userAuthController');
const { isAuthenticated } = require('../middlewares/auth');

// Create/Register user
router.post('/register', registerUser);

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

router.get('/', getUsers);

module.exports = router;
