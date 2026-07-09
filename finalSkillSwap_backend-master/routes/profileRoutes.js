const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  getUserSwaps,
  getUserReviews,
} = require("../controllers/profileController");

// Routes
router.get("/:id", getUserProfile);
router.put("/:id", protect, updateUserProfile);
router.get("/:id/skills", getUserSkills);
router.post("/:id/skills", protect, addUserSkill);
router.delete("/:id/skills/:skillId", protect, removeUserSkill);
router.get("/:id/swaps", getUserSwaps);
router.get("/:id/reviews", getUserReviews);

module.exports = router;