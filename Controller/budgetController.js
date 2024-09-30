const Budget = require("../Model/budgetModel");
const PersonalBudget = require("../Model/personalModel");
const User = require("../Model/emailModel");

// Function to create a budget entry
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
      income: Number(income),
      otherIncome: Number(otherIncome || 0),
      totalIncome,
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

// Function to get a budget entry by ID
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

// Function to view a budget entry by month, year, and userId
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

// Function to update a budget entry
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

    // Convert income and otherIncome to numbers before addition
    const totalIncome = Number(income) + Number(otherIncome || 0);

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { month, year, income: Number(income), otherIncome: Number(otherIncome || 0), totalIncome, userId },
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

// Function to delete a budget entry
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

// Function to calculate budget totals
exports.CalculateBudget = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { month, year, userId } = req.query;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find the user's budget entry for the given month and year
    const budget = await Budget.findOne({ month, year, userId });
    if (!budget) {
      return res.status(404).json({
        message: "No budget found for the selected month and year",
      });
    }

    // Find the user's personal budget entry for the same month and year
    const personalBudget = await PersonalBudget.findOne({ month, year, userId });
    if (!personalBudget) {
      return res.status(404).json({
        message: "No personal budget found for the selected month and year",
      });
    }

    // Calculate total income and total expenses
    const totalIncome = budget.totalIncome;
    const totalExpenses = personalBudget.totalExpenses;

    // Calculate remaining balance
    const remainingBalance = totalIncome - totalExpenses;

    return res.status(200).json({
      message: "Budget calculated successfully",
      totalIncome,
      totalExpenses,
      remainingBalance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to calculate budget",
      error: error.message,
    });
  }
};
