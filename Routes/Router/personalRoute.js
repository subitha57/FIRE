const express = require("express");
const router = express.Router();

const ExpensesAllocation = require("../../Controller/personalController");

router.post("/create", ExpensesAllocation.Create);

router.get("/getById/:id", ExpensesAllocation.getById);

router.put("/update/:id", ExpensesAllocation.update);

router.get("/view", ExpensesAllocation.view);

router.delete("/delete/:id", ExpensesAllocation.delete);

router.get('/getall', ExpensesAllocation.getAll);

module.exports = router;
