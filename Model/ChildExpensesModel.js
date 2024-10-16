const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChildExpensesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expensesId: {
      type: Schema.Types.ObjectId,
      ref: "ExpensesMaster",
      required: true,
    },
    category: [
      {
        type: String,
        required: true,
      },
    ],
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChildExpenses = mongoose.model("ChildExpenses", ChildExpensesSchema);

module.exports = ChildExpenses;
