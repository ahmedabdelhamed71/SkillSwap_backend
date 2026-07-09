const express = require("express");
const router = express.Router();

const {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  searchSkills,
} = require("../controllers/skillcontroller");

router.get("/", getSkills);

router.get("/search", searchSkills);

router.post("/", addSkill);

router.put("/:id", updateSkill);

router.delete("/:id", deleteSkill);

module.exports = router;