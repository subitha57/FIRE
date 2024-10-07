const express = require("express");
const router = express.Router();

const Expenses = require('../../Controller/RealityPage/RealityExpenses');

router.post("/create", Expenses.Create);

router.get('/expenses/:id', Expenses.getById);

router.put('/update/:id', Expenses.Update);

router.delete('/expenses/:id', Expenses.Delete);

module.exports = router;