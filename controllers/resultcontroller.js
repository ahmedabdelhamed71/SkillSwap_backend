const Question = require("../models/Question");
const Result = require("../models/result");

const submitResult = async (req, res) => {
  try {
    const { skillId, answers } = req.body;

    let score = 0;

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);

      if (!question) continue;

      if (question.correctAnswer === answer.answer) {
        score++;
      }
    }

    const result = await Result.create({
      user: req.user._id,
      skill: skillId,
      score,
      totalQuestions: answers.length,
    });

    res.status(201).json({
      message: "Result saved successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({
      user: req.user._id,
    }).populate("skill");

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  submitResult,
  getMyResults,
};
