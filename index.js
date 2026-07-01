const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
app.use(express.json());

const port = process.env.PORT;
const DB_URL = process.env.DB_URL;


mongoose
.connect(DB_URL)
.then(()=>{
  console.log("DB Connected")
})
.catch(()=>{
  console.log("DB Not Connected")
  process.exit(1)
})
app.use("/", (req, res)=>{
  res.status(200).json ({
    msg: "SkillSwap",
  })
})

app.get("/", (req, res)=>{
  res.status(200).json ({
    msg: "SkillSwap",
  })
})

module.exports = "app";