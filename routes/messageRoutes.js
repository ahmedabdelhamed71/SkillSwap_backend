const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} = require("../controllers/messageController");

// Routes (all protected)
router.get("/", protect, getConversations);
router.get("/:id/messages", protect, getMessages);
router.post("/:id/messages", protect, sendMessage);
router.put("/:id/read", protect, markAsRead);

module.exports = router;