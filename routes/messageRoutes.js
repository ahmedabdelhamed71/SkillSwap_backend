const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} = require("../controllers/messageController");

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

// Routes (all protected)
router.get("/", protect, getConversations);
router.get("/:id/messages", protect, getMessages);
router.post("/:id/messages", protect, sendMessage);
router.put("/:id/read", protect, markAsRead);

module.exports = router;