/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please enter your title'],
    trim: true,
    maxlength: [64, 'Your title must not exceed 64 characters'],
  },

  image: {
    type: String,
  },
  message: {
    type: String,
    required: [true, 'Post content is required'],
  },

  username: { type: String, default: '', required: true },
  postedBy: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now() },
});

// const autoPopulateCreatedBy = function (next) {
//   this.populate('createdBy', 'username');
//   next();
// };

// PostSchema.pre('findOne', autoPopulateCreatedBy);

module.exports = mongoose.model('Post', PostSchema);
