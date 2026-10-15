const mongoose = require('mongoose');

const personalDetailsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },

    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be a valid number'],
    },
    
    height: {
      type: String,
      required: [true, 'Height is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PersonalDetails', personalDetailsSchema);
