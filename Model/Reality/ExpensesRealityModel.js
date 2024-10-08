const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for an expense
const expenseSchema = new Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },  // Consider using Date type if preferred
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  data: {
    rent: { type: String },
    phone: { type: String },
    key: { type: String },
    others: {
      key: { type: String }
    }
  }
}, { timestamps: true });

// Create the model from the schema
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
