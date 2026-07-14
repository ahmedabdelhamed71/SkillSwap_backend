const User = require('../models/user');

// Map a user document to the public user DTO
const toUserDTO = (user) => ({
  id: user._id,
  full_name: user.full_name || user.username,
  email: user.email,
  title: user.title || '',
  location: user.location || '',
  bio: user.bio || '',
  verified: user.verified || false,
  verified_expert: user.verified_expert || false,
  top_contributor: user.top_contributor || false,
  joined_at: user.createdAt,
  rating: user.rating || 0,
  reviews_count: user.reviews_count || 0,
  total_swaps: user.total_swaps || 0,
  success_rate: user.success_rate || 0,
  response_time: user.response_time || '',
  session_length: user.session_length || '',
  website: user.website || '',
});

// Get all users (paginated)
const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const { search } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      users: users.map(toUserDTO),
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ user: toUserDTO(user) });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid user id' });
    }
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
// Updating user profile
const updateUser = async (req, res) => {
  try {
        // اليوزر يقدر يعدله ف نفسه بس
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        msg: "You are not allowed to update this profile",
      });
    }

    const {
      full_name,
      title,
      location,
      bio,
      email,
      website,
    } = req.body;
        // منع ان الايميل يتكرر مرتين

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          msg: "Email already exists",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        full_name,
        title,
        location,
        bio,
        email,
        website,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      msg: "Profile updated successfully",
      user: toUserDTO(updatedUser),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server error",
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
};