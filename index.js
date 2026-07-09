const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const contactRoutes = require('./routes/contactRoutes');
const skillRoutes = require('./routes/skillRoutes');
const testRoutes = require('./routes/testRoutes');
const resultRoutes = require('./routes/resultRoutes');
const profileRoutes = require('./routes/profileRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/conversations', messageRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/questions', testRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);

const port = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log('DB Connected');
    return mongoose;
  } catch (error) {
    console.error('DB Not Connected', error);
    process.exit(1);
  }
}

connectDB();

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    msg: 'SkillSwap',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});