const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    full_name: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verified_expert: {
      type: Boolean,
      default: false,
    },

    top_contributor: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews_count: {
      type: Number,
      default: 0,
    },

    total_swaps: {
      type: Number,
      default: 0,
    },

    success_rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    response_time: {
      type: String,
      default: "",
    },

    session_length: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);