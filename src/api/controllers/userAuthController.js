/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const multer = require('multer');
const Jimp = require('jimp');
const HttpStatus = require('http-status-codes');

const ErrorHandler = require('../../services/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../../models/User');
const sendToken = require('../../services/jwtToken');

const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } =
  HttpStatus;

// @desc: Register a new user
// @route: /api/v1/users/register
// @access: protected
exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = await User.create({
    username,
    email,
    password,
  });

  sendToken(newUser, 200, res);
});

// @desc: Get all users-
// @route: /api/v1/users
// @access: protected

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const usersFound = await User.find();

  res.status(StatusCodes.OK).json({
    count: usersFound.length,
    success: true,
    data: usersFound,
  });
});

// @desc: Login a user
// @route: /api/v1/users/login
// @access: protected

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password is entered in by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400));
  }

  // Find user in database
  const userFound = await User.findOne({ email }).select('+password');
  if (!userFound) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Check if password is correct or not
  const isPasswordMatched = await userFound.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  sendToken(userFound, 200, res);
});

// @desc: Logout a user
// @route: /api/v1/users/logout
// @access: protected

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  // To logout is to clear the cookie stored during login/sign up,
  // hence set token to 'null' and expires it immediately with Date.now()
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc: Get currently logged in user details
// @route: /api/v1/users/me
// @access: protected

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const userFound = await User.findById(req.user.id);

  res.status(StatusCodes.OK).json({
    success: true,
    data: userFound,
  });
});

// @desc: Get currently logged in user details
// @route: /api/v1/users/:id
// @access: protected

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const userFound = await User.findById(req.params.id);
  if (!userFound) {
    return next(
      new ErrorHandler(`User is not found with this id: ${req.params.id}`)
    );
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: userFound,
  });
});

// @desc: Update user profile/user-details
// @route: /api/v1/users/me/update
// @access: protected

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { username, email } = req.body;
  const newUser = { username, email };

  // Update avatar: TODO
  const userFound = await User.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(StatusCodes.OK).json({
    success: true,
  });

  sendToken(userFound, 200, res);
});

// @desc: Delete user
// @route: /api/v1/users/admin/:id
// @access: protected

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  // const userFound = await User.findById(req.params.id);
  if (!req.isAuthUser) {
    return next(
      new ErrorHandler('You are not authorized to perform this action')
    );
  }

  // await userFound.remove();
  await User.findOneAndDelete({ _id: req.params.id });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User deleted successfully!',
  });
});

exports.deleteAccount = catchAsyncErrors(async (req, res, next) => {
  const userFound = await User.findById(req.params.id);

  console.log('userFound', userFound);
  console.log(userFound._id);
  if (req.user.id === req.params.id) {
    // await User.findByIdAndDelete(req.params.id);
    await userFound.remove();
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Account deleted successfully!',
    });
  } else if (req.user.id !== req.params.id) {
    // return res.status(403).json('You can delete only your account!');
    return next(new ErrorHandler('You can delete only your account!', 403));
  } else {
    return next(
      new ErrorHandler(`User is not found with this id: ${req.params.id}`)
    );
  }
});

// @desc: Follow user
// @route: /api/v1/users/follow
// @access: protected
exports.addFollowing = catchAsyncErrors(async (req, res, next) => {
  const { followId } = req.body;
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { followings: followId } }
  );
  next();
});

exports.addFollower = catchAsyncErrors(async (req, res, next) => {
  const { followId } = req.body;
  const userFound = await User.findOneAndUpdate(
    { _id: followId },
    { $push: { followers: req.user._id } },
    { new: true }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    data: userFound,
  });
});

// @desc: Delete follower
// @route: /api/v1/users/follow
// @access: protected
exports.deleteFollowing = catchAsyncErrors(async (req, res, next) => {
  const { followId } = req.body;
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { followings: followId } }
  );
  next();
});

exports.deleteFollower = catchAsyncErrors(async (req, res) => {
  const { followId } = req.body;
  const userFound = await User.findOneAndUpdate(
    { _id: followId },
    { $pull: { followers: req.user._id } },
    { new: true }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    data: userFound,
  });
});

// Upload Images
const imageUploadOptions = {
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

exports.uploadImage = multer(imageUploadOptions).single('profilePicture');

exports.resizeImage = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.profilePicture = `/static/uploads/profilePictures/${
    req.user.username
  }-${Date.now()}.${extension}`;
  const image = await Jimp.read(req.file.buffer);
  await image.resize(250, Jimp.AUTO);
  await image.write(`./${req.body.profilePicture}`);
  next();
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  req.body.updatedAt = new Date().toISOString();
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    data: updatedUser,
  });
});

exports.getUserById = catchAsyncErrors(async (req, res, next, id) => {
  const user = await User.findOne(id);
  req.profile = user;
  const profileId = mongoose.Types.ObjectId(req.profile._id);

  if (req.user && profileId.equals(req.user._id)) {
    req.isAuthUser = true;
    return next();
  }
  next();
});

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, userFound) => {
    if (err || !userFound) {
      return next(new ErrorHandler('This user is not found'));
    }
    // If user found, then add d user info to d 'req' obj wt d key = 'profile' & value='userFound'
    req.profile = userFound; // i.e req = {profile:userFound}
    console.log('request.profile', req.profile);
    // Call next middleware
    next();
  });
};
