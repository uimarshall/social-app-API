/* eslint-disable no-unused-vars */

/* eslint-disable consistent-return */
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

// Get Users test
exports.getUsers = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Users routes so created!',
  });
};

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
