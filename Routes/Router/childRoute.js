const express = require("express");
const router = express.Router();
const{verifyToken} = require('../../Middleware/authMiddleware');
const ExpensesChild = require("../../Controller/ChildExpenses");

router.post("/create", verifyToken, ExpensesChild.upsert);

router.get("/all", verifyToken,ExpensesChild.getAll);

// router.get("/getbyid/:expenses_id", verifyToken,ExpensesChild.getById);

// router.delete("/delete/:expenses_id", verifyToken,ExpensesChild.deleteById);

module.exports = router;
