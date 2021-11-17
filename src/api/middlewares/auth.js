/* eslint-disable consistent-return */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const ErrorHandler = require('../../services/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');

// Check if user is authenticated or not
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(token);
  if (!token) {
    return next(
      new ErrorHandler('You need to login first to access this resource.', 401)
    );
  }

  // If token is present, verify/decode the user
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  console.log(`req.user: ${req.user}`);
  next();
});
