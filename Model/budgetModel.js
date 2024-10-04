// const mongoose = require('mongoose');


// const budgetSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User', 
//         required: true
//     },
//     month: {
//         type: String,
//         required: false,
//     },
//     year: {
//         type: Number,
//         required: false,
//     },
//     income: {
//         type: Number,
//         required: false,
//     },
//     otherIncome: {
//         type: Number,
//         default: 0,
//     },
//     totalIncome: {
//         type: Number,
//         required: true,
//     },
//     }, { timestamps: true }
// );

// module.exports = mongoose.model('Budget', budgetSchema);

const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
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
        type: [Number], // Change this to accept an array of numbers
        default: [],
    },
    totalIncome: {
                type: Number,
                required: true,
            },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
