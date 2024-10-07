const express = require("express");
const router = express.Router();

const FireQuestion = require("../../Controller/QuestionPage/fireController");

router.post("/create", FireQuestion.Create);
router.get('/calculate/:fireId', FireQuestion.Calculate);

module.exports = router;