const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    minExp: {
      type: Number,
      default: 0,
    },
    maxExp: {
      type: Number,
      default: 10,
    },
    experience: {
      type: String,
      default: "0-2 Yrs",
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String,
      default: "Not Disclosed",
    },
    skills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    logoText: {
      type: String,
      default: "H",
    },
    postedTime: {
      type: String,
      default: "Just now",
    },
    jobType: {
      type: String,
      default: "Full Time",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
