const express = require("express");
const router = express.Router();

const PersonalBudget = require("../../Controller/personalController");

router.post("/create", PersonalBudget.Create);

router.get("/getById/:id", PersonalBudget.getById);

router.put("/update/:id", PersonalBudget.update);

router.get("/view", PersonalBudget.view);

router.delete("/delate/:id", PersonalBudget.delete);

module.exports = router;
