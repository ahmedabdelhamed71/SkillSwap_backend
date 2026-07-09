const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skillGivenByA: {
      type: String,
      required: true,
    },

    skillGivenByB: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    ratingByA: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    ratingByB: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    reviewByA: {
      type: String,
      default: "",
    },

    reviewByB: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Swap", swapSchema);