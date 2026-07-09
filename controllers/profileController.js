const User = require("../models/user");
const Skill = require("../models/Skill");
const Swap = require("../models/Swap");

// GET /api/users/:id
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/users/:id (Protected - Owner only)
const updateUserProfile = async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const allowedFields = [
      "name", "title", "location", "about", "avatar", "website",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/users/:id/skills
const getUserSkills = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = { userId: req.params.id };
    if (type === "offered" || type === "wanted") {
      filter.type = type;
    }

    const skills = await Skill.find(filter);

    res.status(200).json({ skills });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/users/:id/skills (Protected - Owner only)
const addUserSkill = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, category, level, type, testScore, isQualified } = req.body;

    if (!name || !category || !type) {
      return res.status(400).json({ message: "Name, category, and type are required" });
    }

    if (!["offered", "wanted"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'offered' or 'wanted'" });
    }

    const skill = await Skill.create({
      name,
      category,
      description: req.body.description || "",
      level: level || "Beginner",
      userId: req.params.id,
      type,
      testScore: testScore || null,
      isQualified: isQualified || false,
    });

    res.status(201).json({ message: "Skill added successfully", skill });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/users/:id/skills/:skillId (Protected - Owner only)
const removeUserSkill = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const skill = await Skill.findOneAndDelete({
      _id: req.params.skillId,
      userId: req.params.id,
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({ message: "Skill removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/users/:id/swaps
const getUserSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ userA: req.params.id }, { userB: req.params.id }],
      status: "completed",
    })
      .populate("userA", "name avatar")
      .populate("userB", "name avatar")
      .sort({ completedAt: -1 })
      .limit(10);

    res.status(200).json({ swaps });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/users/:id/reviews
const getUserReviews = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [
        { userB: req.params.id, reviewByA: { $ne: "" } },
        { userA: req.params.id, reviewByB: { $ne: "" } },
      ],
    })
      .populate("userA", "name avatar")
      .populate("userB", "name avatar")
      .sort({ completedAt: -1 })
      .limit(20);

    const reviews = swaps.map((swap) => {
      const isReceiverA = swap.userB._id.toString() === req.params.id;
      return {
        reviewer: isReceiverA ? swap.userA : swap.userB,
        rating: isReceiverA ? swap.ratingByA : swap.ratingByB,
        text: isReceiverA ? swap.reviewByA : swap.reviewByB,
        date: swap.completedAt,
      };
    });

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  getUserSwaps,
  getUserReviews,
};