const express = require("express");
const router = express.Router();

const ExpensesAllocation = require("../../Controller/personalController");

router.post("/create", ExpensesAllocation.Create);

router.get("/getById/:id", ExpensesAllocation.getById);

router.put("/update", ExpensesAllocation.update);

router.get("/view", ExpensesAllocation.view);

router.delete("/delate/:id", ExpensesAllocation.delete);

module.exports = router;
