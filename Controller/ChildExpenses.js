const ChildExpenses = require("../Model/ChildExpensesModel");
const User = require("../Model/emailModel");
const ExpensesMaster = require("../Model/expensesModel");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { id, userId, expensesId, category, title } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    const expensesMaster = await ExpensesMaster.findById(expensesId);
    if (!expensesMaster) {
      return res.status(200).json({ message: "Expenses Master not found" });
    }

    const amount = category.reduce((total, item) => {
      return total + parseFloat(item.amount);
    }, 0);

    const existingExpense = await ChildExpenses.findOne({ userId, expensesId });

    if (existingExpense) {
      const titleExists = existingExpense.category.some(
        (cat) => cat.name === title
      );

      if (titleExists && (!id || existingExpense._id.toString() !== id)) {
        return res.status(200).json({
          statusCode: "1",
          message: `The title '${title}' already exists in the category list for this user.`,
        });
      }
    }

    if (id) {
      const updatedExpense = await ChildExpenses.findByIdAndUpdate(
        id,
        { userId, expensesId, category, amount, title },
        { new: true, upsert: true }
      );
      res.status(201).json({
        statusCode: "0",
        data: updatedExpense,
        message: "ChildExpense Updated Successfully",
      });
    } else {
      const newChildExpense = await new ChildExpenses({
        userId,
        expensesId,
        category,
        amount,
        title,
      }).save();
      res.status(201).json({
        statusCode: "0",
        data: newChildExpense,
        message: "ChildExpense Added Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  try {
    const expenses = await ChildExpenses.find()
      .populate("userId")
      .populate("expensesId");
    res.status(201).json({
      statusCode: "0",
      message: "Expenses data retrieved successfully",
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve expenses data",
    });
  }
};
