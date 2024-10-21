
// const mongoose = require("mongoose");

// const expensesAllocationSchema = new mongoose.Schema({
//   month: {
//     type: String,
//     required: true,
//   },
//   year: {
//     type: Number,
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   categories: {
//     type: Map, 
//     of: Number, 
//     required: true,
//   },
//   totalExpenses: {
//     type: Number,
//     required: true,
//   },
// }, {
//   timestamps: true, 
// });

// const ExpensesAllocation = mongoose.model("ExpensesAllocation", expensesAllocationSchema);

// module.exports = ExpensesAllocation;

// expensesAllocationModel.js

const mongoose = require('mongoose');

const ExpensesAllocationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    titles: [
        {
            title: { type: String, required: true },
            amount: { type: Number, default: 0 }
        }
    ]
}, { timestamps: true });

const ExpensesAllocation = mongoose.model('ExpensesAllocation', ExpensesAllocationSchema);
module.exports = ExpensesAllocation;

