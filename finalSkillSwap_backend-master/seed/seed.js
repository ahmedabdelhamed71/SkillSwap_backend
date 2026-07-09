const mongoose = require("mongoose");
require("dotenv").config();

const Skill = require("../models/Skill");
const Question = require("../models/Question");

const skills = require("./skills");
const questions = require("./questions");

const seedDatabase = async () => {
  try {
    
    await mongoose.connect(process.env.DB_URL);
    console.log(" MongoDB Connected");

    
    await Skill.deleteMany();
    await Question.deleteMany();

    console.log(" Old data deleted");

    
    const insertedSkills = await Skill.insertMany(skills); 

    console.log(" Skills Added");

    // Map skill name => _id
    const skillMap = {};

    insertedSkills.forEach((skill) => {
      skillMap[skill.name] = skill._id;
    });

    
    const formattedQuestions = questions.map((q) => ({
      skill: skillMap[q.skill],
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));

    
    await Question.insertMany(formattedQuestions);

    console.log(" Questions Added");
    console.log(" Database Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();