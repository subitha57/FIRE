const express = require("express");
const router = express.Router();

const Expenses = require('../../Controller/RealityPage/RealityExpenses');

router.post("/create", Expenses.Create);

router.get('/getbyid/:id', Expenses.getById);

router.put('/update/:id', Expenses.Update);

router.delete('/delete/:id', Expenses.Delete);

module.exports = router;