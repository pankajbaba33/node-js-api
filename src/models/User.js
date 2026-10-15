const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    workStatus: {
      type: String,
      enum: ['experienced', 'fresher'],
      default: 'experienced',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    resume: {
      filename: { type: String, default: null },
      originalName: { type: String, default: null },
      path: { type: String, default: null },
      size: { type: Number, default: 0 },
      uploadedAt: { type: Date, default: null },
    },
    sendWhatsApp: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
