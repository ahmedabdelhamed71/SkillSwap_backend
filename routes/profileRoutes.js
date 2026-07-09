const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  getUserProfile,
  updateUserProfile,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  getUserSwaps,
  getUserReviews,
} = require("../controllers/profileController");

// Auth middleware
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Routes
router.get("/:id", getUserProfile);
router.put("/:id", protect, updateUserProfile);
router.get("/:id/skills", getUserSkills);
router.post("/:id/skills", protect, addUserSkill);
router.delete("/:id/skills/:skillId", protect, removeUserSkill);
router.get("/:id/swaps", getUserSwaps);
router.get("/:id/reviews", getUserReviews);

module.exports = router;