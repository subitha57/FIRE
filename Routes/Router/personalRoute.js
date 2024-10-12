const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware')
const ExpensesAllocation = require("../../Controller/BudgetPlan/expensesallocation");

router.post("/create", verifyToken,ExpensesAllocation.Create);

router.get("/getById/:id", verifyToken,ExpensesAllocation.getById);

router.put("/update/:id", verifyToken,ExpensesAllocation.update);

router.get("/view", verifyToken,ExpensesAllocation.view);

router.delete("/delete/:id", verifyToken,ExpensesAllocation.delete);

router.get('/getall', verifyToken,ExpensesAllocation.getAll);

module.exports = router;
