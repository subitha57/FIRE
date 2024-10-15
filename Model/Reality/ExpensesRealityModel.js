// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Define the schema for an expense
// const expenseSchema = new Schema({
//   name: { type: String, required: true },
//   date: { type: String, required: true },  // Consider using Date type if preferred
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   data: {
//     rent: { type: String },
//     phone: { type: String },
//     key: { type: String },
//     others: {
//       key: { type: String }
//     }
//   }
// }, { timestamps: true });

// // Create the model from the schema
// const Expense = mongoose.model('Expense', expenseSchema);

// module.exports = Expense;


const mongoose = require('mongoose');

// Expense Schema
const expenseSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference the User model
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: [String], // Array format for multiple categories
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
