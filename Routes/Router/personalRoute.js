const express = require("express");
const router = express.Router();

const PersonalBudget = require("../../Controller/personalController");

router.post('/create',PersonalBudget.Create);

module.exports = router;