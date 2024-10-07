const mongoose = require('mongoose');

const realityIncomeSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    income: {
        type: Number,
        required: true,
    },
    otherIncome: {
        type: [{ 
            source: String, 
            amount: Number 
        }],
        default: [],
    },
    totalIncome: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('RealityIncome', realityIncomeSchema);
