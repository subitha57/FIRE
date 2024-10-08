const express = require("express");
const router = express.Router();

const Expenses = require('../../Controller/RealityPage/RealityExpenses');

// Routes for expense management
router.post('/expenses', Expenses.createExpense);
router.put('/update/:id', Expenses.updateExpense);
router.get('/getbyid/:id', Expenses.getExpenseById);
router.get('/expenses/user/:userId', Expenses.getExpensesByUser);
router.delete('/delete/:id', Expenses.deleteExpense);

module.exports = router;