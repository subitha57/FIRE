const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const ExpensesChild = require("../../Controller/ChildExpenses");

router.post("/create", verifyToken, ExpensesChild.upsert);

router.get("/all", verifyToken, ExpensesChild.getAll);

router.delete("/delete/:id", verifyToken, ExpensesChild.delete);

router.get("/search", verifyToken, ExpensesChild.search);

module.exports = router;
