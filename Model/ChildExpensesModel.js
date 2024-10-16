const mongoose = require("mongoose");

const ChildExpensesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expensesId: { type: mongoose.Schema.Types.ObjectId, ref: "ExpensesMaster", required: true },
  category: [
    {
      name: { type: String, required: true }, // This is the key (like "Movies")
      amount: { type: Number, required: true }, // This is the value (like "500")
    },
  ],
  amount: { type: Number, required: true },
  title: { type: String, required: true },
});

module.exports = mongoose.model("ChildExpenses", ChildExpensesSchema);
