const express = require("express");
const router = express.Router();
const{verifyToken} = require('../../Middleware/authMiddleware');
const expensesMasterController = require("../../Controller/expensesmasterController");

router.post("/create", verifyToken,expensesMasterController.createExpense);

router.get("/all", verifyToken,expensesMasterController.getAllExpenses);

router.get("/:id", verifyToken,expensesMasterController.getExpenseById);

router.put("/update/:name", verifyToken,expensesMasterController.updateExpense);

router.delete("/delete/:name", verifyToken,expensesMasterController.deleteExpense);

module.exports = router;
