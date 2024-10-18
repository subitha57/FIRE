const mongoose = require('mongoose');

const ExpensesMasterSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('ExpensesMaster', ExpensesMasterSchema);

