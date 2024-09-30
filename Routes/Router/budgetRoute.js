const express = require("express");
const router = express.Router();

const Budget = require('../../Controller/budgetController');

router.post('/create', Budget.Create);
router.get('/getById/:id',Budget.getById);
router.get('/view', Budget.View);
router.put('/update/:id', Budget.Update);
router.delete('/delete/:id', Budget.Delete);

module.exports = router;