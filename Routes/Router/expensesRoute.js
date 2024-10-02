const express = require("express");
const router = express.Router();

const expensesMasterController = require("../../Controller/expensesmasterController");

router.post("/create", expensesMasterController.createExpense);

router.get("/all", expensesMasterController.getAllExpenses);

router.get("/:id", expensesMasterController.getExpenseById);

router.put("/update/:name", expensesMasterController.updateExpense);

router.delete("/delete/:name", expensesMasterController.deleteExpense);

module.exports = router;
