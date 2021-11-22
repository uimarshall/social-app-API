/* eslint-disable  no-unused-vars */
const express = require('express');
const {
  addPost,
  uploadPostsImage,
  resizePostsImage,
  getPostsByUser,
  deletePost,
  getAllPosts,
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

// Get all posts

router.get('/', getAllPosts);

router.param('userId', getUserById);
// Get post by User
router.get('/me/:userId', getPostsByUser);

router.param('postId', getUserById);
// Delete Posts
router.delete('/:postId', isAuthenticated, deletePost);

module.exports = router;
