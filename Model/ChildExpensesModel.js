const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const childExpensesSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expensesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpensesMaster",
      required: true,
    },
    category: [categorySchema],
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChildExpenses = mongoose.model("ChildExpenses", childExpensesSchema);

module.exports = ChildExpenses;
