const express = require('express');

const router = express.Router();

const {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/userAuthController');

// Create/Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.get('/logout', logoutUser);

router.get('/', getUsers);

module.exports = router;
