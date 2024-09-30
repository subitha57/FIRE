const Budget = require("../Model/budgetModel");
const User = require("../Model/emailModel");

exports.Create = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { month, year, income, otherIncome, userId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if a budget entry already exists for the given month, year, and user
    const existingBudget = await Budget.findOne({ month, year, userId });
    if (existingBudget) {
      return res.status(400).json({
        message: "Budget entry already exists for this month and year",
      });
    }

    // Ensure the income and otherIncome are numbers before addition
    const totalIncome = Number(income) + Number(otherIncome || 0);

    // Create a new budget entry
    const newBudget = new Budget({
      month,
      year,
      income: Number(income),  // Ensure income is stored as a number
      otherIncome: Number(otherIncome || 0),  // Ensure otherIncome is stored as a number
      totalIncome,  // Store the calculated total income
      userId,
    });

    // Save the new budget entry
    await newBudget.save();

    // Return the created budget entry
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


exports.getById = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      message: "Budget retrieved successfully",
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve budget",
      error: error.message,
    });
  }
};

exports.View = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { month, year, userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const budget = await Budget.findOne({ month, year, userId });
    if (!budget) {
      return res.status(404).json({
        message: "No budget found for the selected month and year",
      });
    }

    return res.status(200).json({
      message: "Budget retrieved successfully",
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve budget",
      error: error.message,
    });
  }
};

exports.Update = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { id } = req.params;
    const { month, year, income, otherIncome, userId } = req.body;

    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const totalIncome = income + (otherIncome || 0);

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { month, year, income, otherIncome, totalIncome, userId },
      { new: true }
    );

    return res.status(200).json({
      message: "Budget updated successfully",
      budget: updatedBudget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update budget",
      error: error.message,
    });
  }
};

exports.Delete = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    await Budget.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete budget",
      error: error.message,
    });
  }
};
