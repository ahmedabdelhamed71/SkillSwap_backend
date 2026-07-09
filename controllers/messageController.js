const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// GET /api/conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate("participants", "name avatar")
      .sort({ lastMessageTime: -1 });

    // Format response for frontend
    const formattedConversations = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== req.user.id
      );

      return {
        _id: conv._id,
        user: otherUser || { name: "Unknown", avatar: "?" },
        lastMessage: conv.lastMessage,
        time: conv.lastMessageTime,
      };
    });

    res.status(200).json({ conversations: formattedConversations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/conversations/:id/messages
const getMessages = async (req, res) => {
  try {
    // Check if user is a participant
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({
      conversationId: req.params.id,
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/conversations/:id/messages
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    // Check if user is a participant
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Create message
    const message = await Message.create({
      conversationId: req.params.id,
      senderId: req.user.id,
      text: text.trim(),
      status: "sent",
    });

    // Update conversation's last message
    conversation.lastMessage = text.trim();
    conversation.lastMessageTime = message.createdAt;
    conversation.lastMessageSender = req.user.id;
    await conversation.save();

    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/conversations/:id/read
const markAsRead = async (req, res) => {
  try {
    // Check if user is a participant
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Mark all messages from other user as read
    await Message.updateMany(
      {
        conversationId: req.params.id,
        senderId: { $ne: req.user.id },
        status: { $ne: "read" },
      },
      {
        status: "read",
        readAt: new Date(),
      }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
};