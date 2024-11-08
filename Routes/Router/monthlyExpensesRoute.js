const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware')
const monthlyExpenses = require('../../Controller/emergencyFund/monthlyExpenses')

router.post('/addExpenses',verifyToken,monthlyExpenses.create);
router.get('/getAll',verifyToken,monthlyExpenses.getAll);
router.post('/update',verifyToken,monthlyExpenses.upsert)
//router.put('/update/:id',verifyToken,income.put);


module.exports = router;
