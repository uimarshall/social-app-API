/* eslint-disable  no-unused-vars */
const express = require('express');
const {
  addPost,
  uploadPostsImage,
  resizePostsImage,
  getPostsByUser,
} = require('../controllers/postController');
const { getUserById } = require('../controllers/userAuthController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.post(
  '/new/:id',
  isAuthenticated,
  uploadPostsImage,
  resizePostsImage,
  addPost,
  getUserById
);

router.param('userId', getUserById);
// Get post by User
router.get('/me/:userId', getPostsByUser);

module.exports = router;
