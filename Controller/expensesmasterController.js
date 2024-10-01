// expensesMasterController.js
const ExpensesMaster = require('../Model/expensesModel');

// Create a new expense
exports.createExpense = async (req, res) => {
      //#swagger.tags = ['Master-Expenses']
    try {
        const { serialNo, name } = req.body;
        const newExpense = new ExpensesMaster({ serialNo, name });
        await newExpense.save();
        res.status(201).json({ message: 'Expense created successfully', newExpense });
    } catch (error) {
        res.status(500).json({ message: 'Error creating expense', error });
    }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
    //#swagger.tags = ['Master-Expenses']
    try {
        const expenses = await ExpensesMaster.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
};

// Get a single expense by ID
exports.getExpenseById = async (req, res) => {
    //#swagger.tags = ['Master-Expenses']
    try {
        const expense = await ExpensesMaster.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense', error });
    }
};

// Update an expense
exports.updateExpense = async (req, res) => {
    //#swagger.tags = ['Master-Expenses']
    try {
        const { serialNo, name } = req.body;
        const updatedExpense = await ExpensesMaster.findByIdAndUpdate(
            req.params.id,
            { serialNo, name },
            { new: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense updated successfully', updatedExpense });
    } catch (error) {
        res.status(500).json({ message: 'Error updating expense', error });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    //#swagger.tags = ['Master-Expenses']
    try {
        const deletedExpense = await ExpensesMaster.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error });
    }
};
