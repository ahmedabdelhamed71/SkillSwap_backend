const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());

const port = process.env.PORT;
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB Connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
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