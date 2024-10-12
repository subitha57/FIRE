const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware');
const RealityIncome = require('../../Controller/RealityPage/budgetIncome');

router.post('/create', verifyToken,RealityIncome.createIncome);
router.get('/getbyid/:id',verifyToken,RealityIncome.getIncomeById);
router.put('/update/:id', verifyToken,RealityIncome.updateIncome);
router.delete('/delete/:id', verifyToken,RealityIncome.deleteIncome);
router.get('/view', verifyToken,RealityIncome.viewIncome);

module.exports = router;