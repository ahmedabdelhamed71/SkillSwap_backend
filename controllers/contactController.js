const ContactMessage = require('../models/contactMessage');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Map a contact message document to the public DTO
const toContactMessageDTO = (contactMessage) => ({
  id: contactMessage._id,
  full_name: contactMessage.full_name,
  email: contactMessage.email,
  subject: contactMessage.subject,
  message: contactMessage.message,
  created_at: contactMessage.createdAt,
});

// Submit a contact message
const createContactMessage = async (req, res) => {
  try {
    const { full_name, email, subject, message } = req.body;

    if (!full_name || !email || !subject || !message) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ msg: 'Invalid email address' });
    }

    const contactMessage = await ContactMessage.create({
      full_name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      msg: 'Message sent successfully',
      contact_message: toContactMessageDTO(contactMessage),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Invalid contact data' });
    }
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { createContactMessage };
