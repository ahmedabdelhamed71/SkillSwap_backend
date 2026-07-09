const express = require("express");

const router = express.Router();

const {
  getQuestionsBySkill,
  addQuestion,
} = require("../controllers/testController");

router.get("/:skillId", getQuestionsBySkill);

router.post("/", addQuestion);

module.exports = router;