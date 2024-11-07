const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware')
const income = require('../../Controller/income');

router.post('/addIncome',verifyToken,income.create);
router.get('/getById/:id',verifyToken,income.getById);
router.put('/update/:id',verifyToken,income.put);


module.exports = router;


