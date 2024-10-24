const ExpensesMaster = require("../Model/expensesModel");
const ChildExpenses = require("../Model/ChildExpensesModel");
const User = require("../Model/emailModel");
const ExpensesAllocation = require("../Model/ExpensesAllocation");

// exports.upsertExpense = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   const { id, title, userId } = req.body;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(200).json({ message: "User not found" });
//     }

//     if (id) {
//       const updatedExpense = await ExpensesMaster.findByIdAndUpdate(
//         id,
//         { title, active: true, userId },
//         { new: true, upsert: true }
//       );
//       res.status(201).json({
//         statusCode: "0",
//         data: updatedExpense,
//         message: "MasterExpense updated successfully",
//       });
//     } else {
//       const newExpensesMaster = await new ExpensesMaster({
//         title,
//         active: true,
//         userId,
//       }).save();
//       res.status(201).json({
//         statusCode: "0",
//         data: newExpensesMaster,
//         message: "MasterExpense added successfully",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: "1",
//       message: "Failed to add/update MasterExpense",
//       error: error.message,
//     });
//   }
// };
exports.upsertExpense = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  const { id, title, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    if (id) {

      // Update existing expense
      const updatedExpense = await ExpensesMaster.findByIdAndUpdate(
        
        id,
        { title, active: true, userId },
        { new: true, upsert: true }
      );
console.log("updatedExpenses",updatedExpense);
      // Find all allocations for the user
      const allocations = await ExpensesAllocation.find({ userId });

      // Check if any allocations were found
      if (allocations.length > 0) {
        for (const allocation of allocations) {
          // Check if expenses exist in the allocation
          if (allocation.expenses && Array.isArray(allocation.expenses)) {
            const titleExists = allocation.expenses.some(expense => 
              expense.titles && Array.isArray(expense.titles) &&
              expense.titles.some(t => t.title === updatedExpense.title)
            );

            if (!titleExists) {
              allocation.expenses.forEach(expense => {
                if (!expense.titles) {
                  expense.titles = []; // Initialize titles if undefined
                }
                expense.titles.push({ title: updatedExpense.title, amount: 0 });
              });

              await allocation.save(); // Save changes to allocations
            }
          } else {
            console.warn('No expenses found in allocation:', allocation); // Debug log
          }
        }
      }

      return res.status(201).json({
        statusCode: "0",
        data: updatedExpense,
        message: "MasterExpense updated successfully",
      });
    } else {
      // Create new expense
      const newExpensesMaster = await new ExpensesMaster({
        title,
        active: true,
        userId,
      }).save();

      // Check for existing allocations for the user
      const allocations = await ExpensesAllocation.find({ userId });

      // If allocations exist, update them with the new expense title
      if (allocations.length > 0) {
        for (const allocation of allocations) {
          if (allocation.expenses && Array.isArray(allocation.expenses)) {
            allocation.expenses.forEach(expense => {
              if (!expense.titles) {
                expense.titles = []; // Initialize titles if undefined
              }
              expense.titles.push({ title: newExpensesMaster.title, amount: 0 });
            });

            await allocation.save(); // Save changes to allocations
          } else {
            console.warn('No expenses found in allocation:', allocation); // Debug log
          }
        }
      } else {
        // If no allocations exist, create a new one
        const newAllocation = new ExpensesAllocation({
          userId,
          expenses: [
            {
              month: new Date().toLocaleString("default", { month: "long" }),
              year: new Date().getFullYear(),
              titles: [{ title: newExpensesMaster.title, amount: 0 }],
            },
          ],
        });
        await newAllocation.save();
      }

      return res.status(201).json({
        statusCode: "0",
        data: newExpensesMaster,
        message: "MasterExpense added successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: "1",
      message: "Failed to add/update MasterExpense",
      error: error.message,
    });
  }
};



exports.getAll = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.find().populate("userId");

    if (expenses.length === 0) {
      return res.status(200).json({
        statusCode: "0",
        message: "No expenses data found",
        data: [],
      });
    }

    const user = expenses[0].userId;
    const titles = expenses.map((expense) => ({
      id: expense._id,
      title: expense.title,
      active: expense.active,
    }));

    res.status(200).json({
      statusCode: "0",
      message: "Expenses data retrieved successfully",
      userId: user._id,

      titles,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve expenses data",
      error: error.message,
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
        message: "Expense data retrieved successfully",
        data: expenses,
      });
    } else {
      res.status(404).json({
        statusCode: "1",
        message: "Expense ID not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve expense data",
      error: error.message,
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
        res.status(200).json({
          statusCode: "0",
          message: "Expense inactivated successfully",
          data: expenses,
        });
      } else {
        res.status(200).json({
          statusCode: "0",
          message: "Expense activated successfully",
          data: expenses,
        });
      }
    } else {
      res.status(404).json({
        statusCode: "1",
        message: "No expense data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Failed to update expense status",
      error: error.message,
    });
  }
};
