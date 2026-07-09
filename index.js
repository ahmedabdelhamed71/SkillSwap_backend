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

app.get("/", (req, res)=>{
  res.status(200).json ({
    msg: "SkillSwap",
  }) 
 
})
 app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;