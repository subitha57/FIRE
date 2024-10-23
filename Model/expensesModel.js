const mongoose = require('mongoose');

const ExpensesMasterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
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

