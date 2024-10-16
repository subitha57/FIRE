const ChildExpenses = require("../Model/ChildExpensesModel");
const User = require("../Model/emailModel");
const ExpensesMaster = require("../Model/expensesModel");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { id, userId, expensesId, category, title } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the Expenses Master exists
    const expensesMaster = await ExpensesMaster.findById(expensesId);
    if (!expensesMaster) {
      return res.status(404).json({ message: "Expenses Master not found" });
    }

    // Calculate the total amount by summing up the values in the category
    const amount = category.reduce((total, item) => {
      const value = Object.values(item)[0]; // Get the first value in each object
      return total + parseFloat(value); // Add the value to the total
    }, 0);

    // Check if the title already exists in the `category` field for the given `userId`
    const existingExpense = await ChildExpenses.findOne({ userId, expensesId });

    if (existingExpense) {
      // Check if the title already exists in the `category` array
      const titleExists = existingExpense.category.some(cat => Object.keys(cat).includes(title));

      if (titleExists && (!id || existingExpense._id.toString() !== id)) {
        return res.status(400).json({
          statusCode: "1",
          message: `The title '${title}' already exists in the category list for this user.`,
        });
      }
    }

    // Upsert logic (create new or update existing child expense)
    if (id) {
      // Update the existing child expense
      const updatedExpense = await ChildExpenses.findByIdAndUpdate(
        id,
        { userId, expensesId, category, amount, title },
        { new: true, upsert: true }
      );
      res.status(200).json({
        statusCode: "0",
        data: updatedExpense,
        message: "ChildExpense Updated Successfully",
      });
    } else {
      // Create a new child expense
      const newChildExpense = await new ChildExpenses({
        userId,
        expensesId,
        category,
        amount,
        title,
      }).save();
      res.status(200).json({
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

// Get all child expenses
exports.getAll = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  try {
    const expenses = await ChildExpenses.find().populate('userId').populate('expensesId');
    res.status(200).json({
      statusCode: '0',
      message: "Expenses data retrieved successfully",
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: '1',
      message: "Failed to retrieve expenses data",
    });
  }
};
