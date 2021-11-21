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
  deleteUser,
  deleteAccount,
  addFollowing,
  addFollower,
  deleteFollowing,
  deleteFollower,
} = require('../controllers/userAuthController');
const { isAuthenticated } = require('../middlewares/auth');

// Create/Register user
router.post('/register', registerUser);

// Get all users -
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

// Delete user - only admin can do this
router.delete('/delete/:id', isAuthenticated, deleteUser);
// Delete user - only if it is your account
router.delete('/delete/me/:id', isAuthenticated, deleteAccount);

// Add Following
router.put('/follow', isAuthenticated, addFollowing, addFollower);
router.put('/unfollow', isAuthenticated, deleteFollowing, deleteFollower);

router.get('/secret/:id', isAuthenticated, (req, res) => {
  res.json({ user: req.profile });
});

// router.param('id', userById);

module.exports = router;
