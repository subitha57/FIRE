// const mongoose = require('mongoose');

// const ChildExpensesSchema = new mongoose.Schema({
//   expensesId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'ExpensesMaster',  
//     required: true,
//   },
//   category: {
//     type: [String],  
//     required: true,
//   },
// }, { timestamps: true });

// const ChildExpenses = mongoose.model('ChildExpenses', ChildExpensesSchema);

// module.exports = ChildExpenses;


const mongoose = require('mongoose');

const ChildExpensesSchema = new mongoose.Schema({
  expensesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpensesMaster',  
    required: true,
  },
  category: {
    type: [String],  
    required: true,
  },
}, { timestamps: true });

const ChildExpenses = mongoose.model('ChildExpenses', ChildExpensesSchema);

module.exports = ChildExpenses;
