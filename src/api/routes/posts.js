/* eslint-disable  no-unused-vars */
const express = require('express');
const {
  addPost,
  uploadPostsImage,
  resizePostsImage,
} = require('../controllers/postController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.post(
  '/new/:id',
  isAuthenticated,
  uploadPostsImage,
  resizePostsImage,
  addPost
);

module.exports = router;
