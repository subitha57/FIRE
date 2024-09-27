const express = require("express");
const router = express.Router();

const Budget = require('../../Controller/budgetController');


router.post('/create', Budget.Create);



module.exports = router;