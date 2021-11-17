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
  // let token = userFound.getJwtToken();
  // token = `Bearer ${token}`;
  // const { _id, username } = userFound;

  // return res.status(StatusCodes.OK).json({
  //   message: 'SUCCESS',
  //   token,
  //   userFound: {
  //     _id,
  //     email,
  //     username,
  //   },
  // });
});
