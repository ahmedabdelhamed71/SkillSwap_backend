const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    title: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isExpert: {
      type: Boolean,
      default: false,
    },

    contributionRank: {
      type: String,
      default: "Newcomer",
    },

    reputation: {
      type: Number,
      default: 0,
    },

    totalSwaps: {
      type: Number,
      default: 0,
    },

    swapSuccessRate: {
      type: Number,
      default: 0,
    },

    responseTime: {
      type: String,
      default: "N/A",
    },

    joined: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
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