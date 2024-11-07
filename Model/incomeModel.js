const mongoose = require("mongoose");

const realityIncomeSchema = new mongoose.Schema(
  {
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
      type: Number,
      required: true,
    },
    date: { 
      type: Date, 
      required: true, 
      default: Date.now 
    } ,
    income: {
      type: Number, // Store as Number for easier calculations
      required: true,
    },
    otherIncome: {
      type: [Number], // Enforce array of numbers
      required: true,
      validate: [arrayLimit, '{PATH} exceeds the limit of 10'], // Limit to 10 entries
    },
    totalIncome: {
      type: Number, // Calculated as Number for easier summation
      required: true,
    },
  },
  { timestamps: true }
);

// Limit `otherIncome` array to 10 entries
function arrayLimit(val) {
  return val.length <= 10;
}

// Create unique index to avoid duplicate month entries for each user
realityIncomeSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("RealityIncome", realityIncomeSchema);
