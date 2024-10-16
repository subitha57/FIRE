// expensesMasterModel.js
const mongoose = require('mongoose');

const ExpensesMasterSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('ExpensesMaster', ExpensesMasterSchema);
