const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Map,
      of: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expenses", expenseSchema);
