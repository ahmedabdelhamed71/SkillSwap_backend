const mongoose = require("mongoose");
const Question = require("../models/Question");





const addQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);

    res.status(201).json({
      message: "Question added successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};





const getQuestionsBySkill = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      {
        $match: {

          skill: new mongoose.Types.ObjectId(req.params.skillId),

        },
      },
      {
        $sample: {
          size: 5,
        },
      },
      {
        $project: {
          question: 1,
          options: 1,
        },
      },
    ]);

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateQuestion = async (req, res) => {
  try {

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );


    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json({
      message: "Question updated successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};





const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  addQuestion,

  getQuestionsBySkill,
  updateQuestion,
  deleteQuestion,
};

