const express = require('express');

const router = express.Router();

const {
  getUsers,
  registerUser,
  loginUser,
} = require('../controllers/userAuthController');

// Create/Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

router.get('/', getUsers);

module.exports = router;
