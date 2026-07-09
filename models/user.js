const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

    avatar: {
      type: String,
      default: "",
    },

    website: {
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

    contributionRank: {
      type: String,
      default: "Newcomer",
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

    joined: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password when sending user data to frontend
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);