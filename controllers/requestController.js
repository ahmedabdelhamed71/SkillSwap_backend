const Request = require('../models/request');
const User = require('../models/user');
const Skill = require('../models/skill');

const USER_FIELDS = 'username full_name title verified';
const SKILL_FIELDS = 'name';

// Map a populated user to the embedded user DTO
const toUserSummaryDTO = (user) =>
  user
    ? {
        id: user._id,
        full_name: user.full_name || user.username,
        title: user.title || '',
        verified: user.verified || false,
      }
    : null;

// Map a request document (with populated refs) to the request DTO
const toRequestDTO = (request) => ({
  id: request._id,
  status: request.status,
  created_at: request.createdAt,
  sender: toUserSummaryDTO(request.sender),
  receiver: toUserSummaryDTO(request.receiver),
  requested_skill: request.skill
    ? { id: request.skill._id, name: request.skill.name }
    : null,
  message: request.message || '',
});

const populateRequest = (query) =>
  query
    .populate('sender', USER_FIELDS)
    .populate('receiver', USER_FIELDS)
    .populate('skill', SKILL_FIELDS);

// Create a new swap request
const createRequest = async (req, res) => {
  try {
    const { receiver, skill, message } = req.body;

    if (!receiver || !skill) {
      return res.status(400).json({ msg: 'Receiver and skill are required' });
    }

    if (receiver === req.user._id.toString()) {
      return res
        .status(400)
        .json({ msg: 'You cannot send a request to yourself' });
    }

    const [receiverUser, skillDoc] = await Promise.all([
      User.findById(receiver).select('_id'),
      Skill.findById(skill).select('_id'),
    ]);

    if (!receiverUser) {
      return res.status(404).json({ msg: 'Receiver not found' });
    }

    if (!skillDoc) {
      return res.status(404).json({ msg: 'Skill not found' });
    }

    const duplicate = await Request.findOne({
      sender: req.user._id,
      receiver,
      skill,
      status: 'pending',
    });

    if (duplicate) {
      return res.status(409).json({ msg: 'A pending request already exists' });
    }

    const request = await Request.create({
      sender: req.user._id,
      receiver,
      skill,
      message: message || '',
    });

    const populated = await populateRequest(Request.findById(request._id));

    res.status(201).json({ request: toRequestDTO(populated) });
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Invalid request data' });
    }
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get requests received by the authenticated user
const getIncomingRequests = async (req, res) => {
  try {
    const requests = await populateRequest(
      Request.find({ receiver: req.user._id }).sort({ createdAt: -1 }),
    );

    res.status(200).json({ requests: requests.map(toRequestDTO) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get requests sent by the authenticated user
const getOutgoingRequests = async (req, res) => {
  try {
    const requests = await populateRequest(
      Request.find({ sender: req.user._id }).sort({ createdAt: -1 }),
    );

    res.status(200).json({ requests: requests.map(toRequestDTO) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get a single request (sender or receiver only)
const getRequestById = async (req, res) => {
  try {
    const request = await populateRequest(Request.findById(req.params.id));

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    const userId = req.user._id.toString();
    const isParticipant =
      request.sender?._id.toString() === userId ||
      request.receiver?._id.toString() === userId;

    if (!isParticipant) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.status(200).json({ request: toRequestDTO(request) });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ msg: 'Request not found' });
    }
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Shared accept/reject transition logic (receiver only, pending only)
const updateRequestStatus = (newStatus) => async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          msg: `Only the receiver can ${newStatus === 'accepted' ? 'accept' : 'reject'} this request`,
        });
    }

    if (request.status !== 'pending') {
      return res
        .status(400)
        .json({
          msg: `Cannot ${newStatus === 'accepted' ? 'accept' : 'reject'} a request that is already ${request.status}`,
        });
    }

    request.status = newStatus;
    await request.save();

    const populated = await populateRequest(Request.findById(request._id));

    res.status(200).json({ request: toRequestDTO(populated) });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ msg: 'Request not found' });
    }
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const acceptRequest = updateRequestStatus('accepted');
const rejectRequest = updateRequestStatus('rejected');

module.exports = {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
};
