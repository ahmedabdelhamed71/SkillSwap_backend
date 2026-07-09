const express = require("express");
const router = express.Router();

const {
  addQuestion,
  getQuestionsBySkill,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/testController");


router.get("/:skillId", getQuestionsBySkill);

router.post("/", addQuestion);

router.put("/:id", updateQuestion);

router.delete("/:id", deleteQuestion);

module.exports = router;