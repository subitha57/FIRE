const ExpensesMaster = require("../Model/expensesModel");

exports.upsertExpense = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  const { id, title } = req.body;
  try {
    if (id) {
      const updatedExpense = await ExpensesMaster.findByIdAndUpdate(
        id,
        { title },
        { new: true, upsert: true }
      );
      res
        .status(200)
        .json({
          statusCode: "0",
          data: updatedExpense,
          message: "MasterExpenses Updated Successfully",
        });
    } else {
      const newExpensesMaster = await new ExpensesMaster({ title }).save();
      res
        .status(200)
        .json({
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
    });
    if (expenses) {
      res.status(200).json({
        statusCode: "0",
        message: "expenses Id retrived successfully",
        data: expenses,
      });
    } else {
      res.status(404).json({
        message: "expenses Id not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrived expenses data",
    });
  }
};

exports.deleteById = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.findOne({
      _id: req.params.expenses_id,
    });
    if (expenses) {
      await ExpensesMaster.deleteOne({ _id: req.params.expenses_id });
      res.status(200).json({
        message: "expenses data deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "No expenses data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete a expenses ",
    });
  }
};
