const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware')
const monthlyExpenses = require('../../Controller/emergencyFund/monthlyExpenses')

router.post('/addExpenses',verifyToken,monthlyExpenses.create);

//router.put('/update/:id',verifyToken,income.put);


module.exports = router;
