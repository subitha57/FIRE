const express = require("express");
const router = express.Router();
const ExpensesAllocation = require("../../Controller/BudgetPlan/expensesallocation");
const { verifyToken } = require("../../Middleware/authMiddleware");

router.post("/create", verifyToken, ExpensesAllocation.upsert);

router.delete("/delete/:id", verifyToken, ExpensesAllocation.delete);

router.get("/getAll", verifyToken, ExpensesAllocation.getAll);

module.exports = router;
