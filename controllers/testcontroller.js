const Question = require("../models/Question");


const getQuestionsBySkill = async (req, res) => {
  try {
    const questions = await Question.find({
      skill: req.params.skillId,
    });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const addQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);

    res.status(201).json({
      message: "Question Added",
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getQuestionsBySkill,
  addQuestion,
};