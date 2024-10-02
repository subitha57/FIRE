const ExpensesMaster = require("../Model/expensesModel");

exports.createExpense = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const { serialNo, name } = req.body;

    const existingSerialNo = await ExpensesMaster.findOne({ serialNo });
    if (existingSerialNo) {
      return res
        .status(400)
        .json({
          message: "Serial number already exists, please use a different one",
        });
    }

    const existingName = await ExpensesMaster.findOne({ name });
    if (existingName) {
      return res
        .status(400)
        .json({ message: "Expense with this name already exists" });
    }

    const newExpense = new ExpensesMaster({ serialNo, name });
    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense created successfully", newExpense });
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error });
  }
};

exports.getAllExpenses = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

exports.getExpenseById = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expense = await ExpensesMaster.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense", error });
  }
};

exports.updateExpense = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const { serialNo, name } = req.body;
    const updatedExpense = await ExpensesMaster.findOneAndUpdate(
      { name: req.params.name }, // Find by name
      { serialNo, name }, // Update serialNo and name
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res
      .status(200)
      .json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
};

exports.deleteExpense = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const deletedExpense = await ExpensesMaster.findOneAndDelete({
      name: req.params.name,
    }); // Find by name
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
};
