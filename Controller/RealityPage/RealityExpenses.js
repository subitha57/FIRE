// const Expense = require("../../Model/Reality/ExpensesRealityModel");
// const User = require("../../Model/emailModel");

// exports.createExpense = async (req, res) => {
//   //#swagger.tags = ['Reality-Expenses']
//   try {
//     const { name, date, userId, data } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const newExpense = new Expense({
//       name,
//       date,
//       userId,
//       data,
//     });

//     const savedExpense = await newExpense.save();
//     return res.status(201).json({
//       message: "Expense created successfully",
//       expense: savedExpense,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// exports.updateExpense = async (req, res) => {
//   //#swagger.tags = ['Reality-Expenses']
//   try {
//     const { id } = req.params;
//     const { name, date, data } = req.body;

//     const expense = await Expense.findById(id);
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }

//     expense.name = name || expense.name;
//     expense.date = date || expense.date;
//     expense.data = data || expense.data;

//     const updatedExpense = await expense.save();
//     return res.status(200).json({
//       message: "Expense updated successfully",
//       expense: updatedExpense,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// exports.getExpenseById = async (req, res) => {
//   //#swagger.tags = ['Reality-Expenses']
//   try {
//     const { id } = req.params;

//     const expense = await Expense.findById(id);
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }

//     return res.status(200).json(expense);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// exports.getExpensesByUser = async (req, res) => {
//   //#swagger.tags = ['Reality-Expenses']
//   try {
//     const { userId } = req.params;

//     const expenses = await Expense.find({ userId });
//     if (!expenses || expenses.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No expenses found for this user" });
//     }

//     return res.status(200).json(expenses);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// exports.deleteExpense = async (req, res) => {
//   //#swagger.tags = ['Reality-Expenses']
//   try {
//     const { id } = req.params;

//     const deletedExpense = await Expense.findByIdAndDelete(id);
//     if (!deletedExpense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }
//     return res.status(200).json({ message: "Expense deleted successfully" });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

const express = require('express');
const router = express.Router();
const Expense = require('../../Model/Reality/ExpensesRealityModel');
const User = require('../../Model/emailModel');


exports.createExpense = async (req, res) => {
    const { userId, title, category, amount } = req.body;
    
    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new Expense
        const newExpense = new Expense({
            userId: user._id,
            title,
            category,
            amount
        });

        await newExpense.save();

        res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
    } catch (error) {
        res.status(500).json({ message: 'Error creating expense', error });
    }
};


