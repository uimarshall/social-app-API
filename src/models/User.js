/* eslint-disable func-names */

const crypto = require('crypto'); // built-in pkg

/* eslint-disable  no-underscore-dangle */

const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const validator = require('validator');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter your username'],
      trim: true,
      lowercase: true,
      minlength: [2, 'Your name must not be less than 2 characters'],
      maxlength: [32, 'Your name must not exceed 32 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [6, 'Your password must be at least 6 characters'],
      select: false, // Don't display the password along the user info
    },

    profilePicture: {
      type: String,
      required: [true, 'profile image is required'],
      default: '/static/images/profile.png',
    },

    about: { type: String, trim: true },
    followings: [{ type: ObjectId, ref: 'User' }],

    followers: [{ type: ObjectId, ref: 'User' }],

    // createdAt: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

const autoPopulateFollowingAndFollowers = function (next) {
  this.populate('followings', '_id username profilePicture,');
  this.populate('followers', '_id username profilePicture,');
  next();
};

UserSchema.pre('findOne', autoPopulateFollowingAndFollowers);

// Encrypt password before saving user to database
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare user password
UserSchema.methods.comparePassword = async function (currEnteredPassword) {
  const passwordMatch = await bcrypt.compare(
    currEnteredPassword,
    this.password
  );
  return passwordMatch;
};

// Return JWT token
UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};

// Generate password reset token

UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash/encrypt token and set to resetPasswordToken
  // This is saved in the database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expire time in seconds(30mins)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
