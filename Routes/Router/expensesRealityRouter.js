const express = require("express");
const router = express.Router();
// const{verifyToken} = require('../../Middleware/authMiddleware');
const Expenses = require('../../Controller/RealityPage/RealityExpenses');


router.post('/expenses', Expenses.createExpense);
// router.put('/update/:id', verifyToken,Expenses.updateExpense);
// router.get('/getbyid/:id', verifyToken,Expenses.getExpenseById);
// router.get('/expenses/user/:userId', verifyToken,Expenses.getExpensesByUser);
// router.delete('/delete/:id', verifyToken,Expenses.deleteExpense);

module.exports = router;