const ExpensesMaster = require("../Model/expensesModel");
const ChildExpenses = require("../Model/ChildExpensesModel");

exports.upsertExpense = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  const { id, title } = req.body;
  try {
    if (id) {
      const updatedExpense = await ExpensesMaster.findByIdAndUpdate(
        id,
        { title, active: true },
        { new: true, upsert: true }
      );
      res.status(201).json({
        statusCode: "0",
        data: updatedExpense,
        message: "MasterExpenses Updated Successfully",
      });
    } else {
      const newExpensesMaster = await new ExpensesMaster({
        title,
        active: true,
      }).save(); 
      res.status(201).json({
        statusCode: "0",
        data: newExpensesMaster,
        message: "MasterExpenses Added Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ statusCode: "1", message: error.message });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.find();
    res.status(200).json({
      statusCode: "0",
      message: "Expenses data retrived Successfully",
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrived expenses data",
    });
  }
};

exports.getById = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.findOne({
      _id: req.params.expenses_id,
      active: true,
    });
    if (expenses) {
      res.status(200).json({
        statusCode: "0",
        message: "Expense ID retrieved successfully",
        data: expenses,
      });
    } else {
      res.status(404).json({
        message: "Expense ID not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve expenses data",
    });
  }
};

exports.deleteById = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.findById(req.params.expenses_id);

    if (expenses) {
      expenses.active = !expenses.active;
      await expenses.save();

      if (!expenses.active) {
        await ChildExpenses.deleteMany({ expensesId: req.params.expenses_id });
        res.status(201).json({
          message: "Expenses data marked as deleted successfully",
        });
      } else {
        res.status(201).json({
          message: "Expenses data reactivated successfully",
        });
      }
    } else {
      res.status(404).json({
        message: "No expenses data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update expenses status",
      error: error.message,
    });
  }
};
