const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const skillRoutes = require("./routes/skillRoutes");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/skills", skillRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/conversations", messageRoutes);

const port = process.env.PORT;
const DB_URL = process.env.DB_URL;

// Database connection
mongoose
.connect(DB_URL)
.then(()=>{
  console.log("DB Connected")
})
.catch((err)=>{
  console.error("DB Not Connected", err)
  process.exit(1)
})

// Root endpoint
app.get("/", (req, res)=>{
  res.status(200).json ({
    msg: "SkillSwap",
  }) 
 
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;