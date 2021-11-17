const express = require('express');

const router = express.Router();

const { getUsers, registerUser } = require('../controllers/userAuthController');

// Create/Register user
router.post('/register', registerUser);
// Login user

router.get('/', getUsers);

module.exports = router;
