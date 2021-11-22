/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const multer = require('multer');
const Jimp = require('jimp');
const HttpStatus = require('http-status-codes');

const ErrorHandler = require('../../services/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Post = require('../../models/Post');

const sendToken = require('../../services/jwtToken');
const APIFeatures = require('../../services/apiFeatures');

const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } =
  HttpStatus;

// Upload Images
const postsImageUploadOptions = {
  storage: multer.memoryStorage(),
  // conditioning image size/file to 1mb
  limits: { fileSize: 1024 * 1024 * 1 },
  fileFilter: (req, file, next) => {
    if (file.mimetype.startsWith('image/')) {
      next(null, true);
    } else {
      next(null, false);
    }
  },
};

exports.uploadPostsImage = multer(postsImageUploadOptions).single('image');

exports.resizePostsImage = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.image = `/static/uploads/${
    req.user.username
  }-${Date.now()}.${extension}`;
  const image = await Jimp.read(req.file.buffer);
  await image.resize(750, Jimp.AUTO);
  await image.write(`./${req.body.image}`);
  next();
});

// Create Post

exports.addPost = catchAsyncErrors(async (req, res) => {
  req.body.postedBy = req.user._id;
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: 'postedBy',
    select: '_id username,profilePicture',
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: post,
  });
});

// const apiFeatures = new APIFeatures();
// Get a Users Posts
exports.getPostsByUser = catchAsyncErrors(async (req, res) => {
  const posts = await Post.find({ postedBy: req.profile._id }).sort({
    createdAt: 'desc',
  });
  res.status(StatusCodes.OK).json({
    count: posts.length,
    data: posts,
  });
});

// @desc: Get All posts
// @route: /api/v1/posts?keyword=educate
// @access: public
// Product.find() = query
// req.query = queryStr

exports.getAllPosts = catchAsyncErrors(async (req, res) => {
  // Count total number of documents in the Db
  const potsCount = await Post.countDocuments();
  const apiFeatures = new APIFeatures(Post.find(), req.query).search();
  await apiFeatures.query.exec((err, postsFound) => {
    if (err) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: getReasonPhrase(StatusCodes.NOT_FOUND),
        status: 'FAIL',
      });
    }
    return res.status(StatusCodes.OK).json({
      count: postsFound.length,
      potsCount,
      data: postsFound,
      message: 'SUCCESS',
    });
  });
});

exports.getPostById = catchAsyncErrors(async (req, res, next, id) => {
  const post = await Post.findOne({ _id: id });
  req.post = post;
  const posterId = mongoose.Types.ObjectId(req.post.postedBy._id);

  if (req.user && posterId.equals(req.user._id)) {
    req.isPoster = true;
    return next();
  }
  next();
});

// Delete Posts
exports.deletePost = catchAsyncErrors(async (req, res, next) => {
  if (!req.isPoster) {
    return next(new ErrorHandler('You can delete only your post!', 403));
  }
  await Post.findOneAndDelete({ _id: req.post._id });
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Posts deleted successfully!',
  });
});
