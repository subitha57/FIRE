// const Expenses = require("../../Model/Reality/ExpensesRealityModel");
// const User = require("../../Model/emailModel");

// exports.Create = async (req, res) => {
//     //#swagger.tags = ['Reality-Expenses']
//   try {
//     const { name, data, userId, month, year } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const newExpense = new Expenses({
//       name,
//       data,
//       userId,
//       month,
//       year,
//     });

//     await newExpense.save();

//     res.status(201).json({
//       message: "Expense added successfully",
//       newExpense,
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: "Failed to add expense",
//       details: err.message,
//     });
//   }
// };

// exports.getById = async (req, res) => {
//     //#swagger.tags = ['Reality-Expenses']
//   try {
//     const { id } = req.params;

//     const expense = await Expenses.findById(id);
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }

//     res.status(200).json({
//       message: "Expense retrieved successfully",
//       expense,
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: "Failed to retrieve expense",
//       details: err.message,
//     });
//   }
// };

// exports.Update = async (req, res) => {
//     //#swagger.tags = ['Reality-Expenses']
//   try {
//     const { id } = req.params;
//     const { name, data, userId, month, year } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const updatedExpense = await Expenses.findByIdAndUpdate(
//       id,
//       { name, data, month, year },
//       { new: true }
//     );

//     if (!updatedExpense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }

//     res.status(200).json({
//       message: "Expense updated successfully",
//       expense: updatedExpense,
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: "Failed to update expense",
//       details: err.message,
//     });
//   }
// };

// exports.Delete = async (req, res) => {
//     //#swagger.tags = ['Reality-Expenses']
//   try {
//     const { id } = req.params;

//     const expense = await Expenses.findById(id);
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }

//     await Expenses.findByIdAndDelete(id);

//     res.status(200).json({ message: "Expense deleted successfully" });
//   } catch (err) {
//     res.status(500).json({
//       error: "Failed to delete expense",
//       details: err.message,
//     });
//   }
// };

const Expense = require('../../Model/Reality/ExpensesRealityModel');  // Assuming you have an Expense model set up
const User = require('../../Model/emailModel');        // Assuming you have a User model (emailModel User Schema)

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { name, date, userId, data } = req.body;

    // Check if userId exists in the User collection
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the expense object
    const newExpense = new Expense({
      name,
      date,
      userId,
      data
    });

    // Save the new expense to the database
    const savedExpense = await newExpense.save();
    return res.status(201).json({
      message: "Expense created successfully",
      expense: savedExpense
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params; // ID of the expense to update
    const { name, date, data } = req.body;

    // Find the expense by ID
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Update the fields
    expense.name = name || expense.name;
    expense.date = date || expense.date;
    expense.data = data || expense.data;

    // Save the updated expense to the database
    const updatedExpense = await expense.save();
    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get an expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the expense by ID
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json(expense);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all expenses for a specific user
exports.getExpensesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all expenses for the user
    const expenses = await Expense.find({ userId });
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found for this user" });
    }

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the expense by ID and delete it
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
