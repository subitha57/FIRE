const ChildExpenses = require("../Model/ChildExpensesModel");
const User = require("../Model/emailModel");
const ExpensesMaster = require("../Model/expensesModel");

// Upsert child expense (create new or update existing)
exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { id, userId, expensesId, category, title } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the linked master expense exists
    const expensesMaster = await ExpensesMaster.findById(expensesId);
    if (!expensesMaster) {
      return res.status(404).json({ message: "Expenses Master not found" });
    }

    // Calculate the total amount by counting categories (assuming each category adds to the total)
    const amount = category.length; // Here, you can calculate the amount based on your logic

    if (id) {
      // Update existing child expense
      const updatedExpense = await ChildExpenses.findByIdAndUpdate(
        id,
        { userId, expensesId, category, amount, title },
        { new: true, upsert: true }
      );
      res.status(200).json({
        statusCode: '0',
        data: updatedExpense,
        message: 'ChildExpense Updated Successfully',
      });
    } else {
      // Create new child expense
      const newChildExpense = await new ChildExpenses({
        userId,
        expensesId,
        category,
        amount,
        title,
      }).save();
      res.status(200).json({
        statusCode: '0',
        data: newChildExpense,
        message: 'ChildExpense Added Successfully',
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: '1',
      message: error.message,
    });
  }
};

// Get all child expenses for a specific user
exports.getAll = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { userId } = req.body; // Assuming userId is passed in the body

  try {
    const childExpenses = await ChildExpenses.find({ userId }).populate('expensesId'); // Populate expensesId
    res.status(200).json({
      statusCode: '0',
      message: "Child expenses data retrieved successfully",
      data: childExpenses,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: '1',
      message: "Failed to retrieve child expenses data",
    });
  }
};

