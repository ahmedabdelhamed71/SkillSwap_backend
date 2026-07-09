const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  submitResult,
  getMyResults,
} = require("../controllers/resultController");

router.post("/", protect, submitResult);

router.get("/my-results", protect, getMyResults);

module.exports = router;