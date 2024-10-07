const express = require("express");
const router = express.Router();

const Budget = require('../../Controller/RealityPage/budgetIncome');

router.post('/create', Budget.createRealityIncome);
router.get('/getById/:id',Budget.getById);
router.get('/view', Budget.View);
router.put('/update/:id', Budget.Update);
router.delete('/delete/:id', Budget.Delete);
router.get('/calculate', Budget.CalculateBudget);

module.exports = router;