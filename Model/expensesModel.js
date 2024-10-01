// expensesMasterModel.js
const mongoose = require('mongoose');

const ExpensesMasterSchema = new mongoose.Schema({
    serialNo: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('ExpensesMaster', ExpensesMasterSchema);
