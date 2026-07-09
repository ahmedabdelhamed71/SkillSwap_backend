const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

const skillRoutes = require("./routes/skillRoutes");
const testRoutes = require("./routes/testRoutes"); 
const resultRoutes = require("./routes/resultRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/skills", skillRoutes);
app.use("/api/questions", testRoutes);
app.use("/api/tests", testRoutes); 
app.use("/api/results", resultRoutes);

const port = process.env.PORT;
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB Connected");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB Not Connected");
    console.log(error.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "SkillSwap",
  });
});