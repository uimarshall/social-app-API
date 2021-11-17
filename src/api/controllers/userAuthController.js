/* eslint-disable no-unused-vars */

/* eslint-disable consistent-return */
const HttpStatus = require('http-status-codes');

const ErrorHandler = require('../../services/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../../models/User');

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

  let token = newUser.getJwtToken();
  token = `Bearer ${token}`;

  res.status(StatusCodes.CREATED).json({
    message: 'SUCCESS',
    token,
  });
});

exports.getUsers = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Users routes so created!',
  });
};
