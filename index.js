<<<<<<< HEAD
const express = require('express');
=======
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

const skillRoutes = require("./routes/skillRoutes");
const testRoutes = require("./routes/testRoutes");

>>>>>>> 0b35c47 (Add authentication API with JWT cookies)
const app = express();
const mongoose = require('mongoose');
const skillRoutes = require('./routes/skillRoutes');
const testRoutes = require('./routes/testRoutes');
require('dotenv').config();

app.use(express.json());
<<<<<<< HEAD
app.use('/api/skills', skillRoutes);
app.use('/api/questions', testRoutes);
app.use('/api/tests', testRoutes);
=======
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
>>>>>>> 0b35c47 (Add authentication API with JWT cookies)

const port = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

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

app.get('/', (req, res) => {
  res.status(200).json({
    msg: 'SkillSwap',
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.status(200).json({
    msg: 'SkillSwap',
  });
});
