const Expenses = require("../../Model/Reality/ExpensesRealityModel");
const User = require("../../Model/emailModel");

exports.Create = async (req, res) => {
    //#swagger.tags = ['Reality-Expenses']
  try {
    const { name, data, userId, month, year } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newExpense = new Expenses({
      name,
      data,
      userId,
      month,
      year,
    });

    const savedExpense = await newExpense.save();

    res.status(201).json({
      message: "Expense added successfully",
      expenseId: savedExpense._id,
      expense: savedExpense,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to add expense",
      details: err.message,
    });
  }
};

exports.getById = async (req, res) => {
    //#swagger.tags = ['Reality-Expenses']
  try {
    const { id } = req.params;

    const expense = await Expenses.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: "Expense retrieved successfully",
      expense,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve expense",
      details: err.message,
    });
  }
};

exports.Update = async (req, res) => {
    //#swagger.tags = ['Reality-Expenses']
  try {
    const { id } = req.params;
    const { name, data, userId, month, year } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedExpense = await Expenses.findByIdAndUpdate(
      id,
      { name, data, month, year },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update expense",
      details: err.message,
    });
  }
};

exports.Delete = async (req, res) => {
    //#swagger.tags = ['Reality-Expenses']
  try {
    const { id } = req.params;

    const expense = await Expenses.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await Expenses.findByIdAndDelete(id);

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete expense",
      details: err.message,
    });
  }
};
