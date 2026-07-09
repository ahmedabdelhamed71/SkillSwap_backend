const express = require('express');
const app = express();
const mongoose = require('mongoose');
const skillRoutes = require("./routes/skillRoutes");
const testRoutes = require("./routes/testRoutes");
require('dotenv').config()
app.use(express.json());
app.use("/api/skills", skillRoutes);
app.use("/api/tests", testRoutes);

const port = process.env.PORT;
const DB_URL = process.env.DB_URL;



mongoose
.connect(DB_URL)
.then(()=>{
  console.log("DB Connected")
})
.catch((err)=>{
  console.error("DB Not Connected", err)
  process.exit(1)
})

app.get("/", (req, res)=>{
  res.status(200).json ({
    msg: "SkillSwap",
  }) 
 
})
 app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;