const mongoose = require("mongoose");

const childExpensesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencing the User model from emailModel.js
    required: true,
  },
  expensesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpensesMaster", // Referencing the ExpensesMaster model
    required: true,
  },
  category: {
    type: [String], // Array of category strings (e.g. ["phone", "gas"])
    required: true,
  },
  amount: {
    type: Number, // Sum of all values tied to the categories
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChildExpenses = mongoose.model("ChildExpenses", childExpensesSchema);

module.exports = ChildExpenses;
