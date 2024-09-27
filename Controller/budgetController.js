const Budget = require("../Model/budgetModel");
const User = require("../Model/emailModel");

exports.Create = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { month, year, income, otherIncome, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingBudget = await Budget.findOne({ month, year, userId });
    if (existingBudget) {
      return res.status(400).json({
        message: "Budget entry already exists for this month and year",
      });
    }

    const totalIncome = income + (otherIncome || 0);

    const newBudget = new Budget({
      month,
      year,
      income,
      otherIncome: otherIncome || 0,
      totalIncome,
      userId,
    });

    await newBudget.save();

    return res.status(201).json({
      message: "Budget entry created successfully",
      budget: newBudget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create budget entry",
      error: error.message,
    });
  }
};

