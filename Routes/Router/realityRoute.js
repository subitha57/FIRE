const express = require("express");
const router = express.Router();

const RealityIncome = require('../../Controller/RealityPage/budgetIncome');

router.post('/create', RealityIncome.createIncome);
router.get('/getbyid/:id', RealityIncome.getIncomeById);
router.put('/update/:id', RealityIncome.updateIncome);
router.delete('/delete/:id', RealityIncome.deleteIncome);
router.get('/view', RealityIncome.viewIncome);

module.exports = router;