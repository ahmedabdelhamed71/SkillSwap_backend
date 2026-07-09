const mongoose = require('mongoose');

const REQUEST_STATUS = ['pending', 'accepted', 'rejected'];

const requestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    status: {
      type: String,
      enum: REQUEST_STATUS,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

// Fast lookups for incoming/outgoing lists
requestSchema.index({ receiver: 1, status: 1, createdAt: -1 });
requestSchema.index({ sender: 1, status: 1, createdAt: -1 });

// Prevent duplicate pending requests for the same sender/receiver/skill
requestSchema.index(
  { sender: 1, receiver: 1, skill: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } },
);

module.exports = mongoose.model('Request', requestSchema);
module.exports.REQUEST_STATUS = REQUEST_STATUS;
