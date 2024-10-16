// const ChildExpenses = require("../Model/ChildExpensesModel");
// const User = require("../Model/emailModel");
// const ExpensesMaster = require("../Model/expensesModel");

// exports.upsert = async (req, res) => {
//   //#swagger.tags = ['Child-Expenses']
//   const { id, userId, expensesId, category, title } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const expensesMaster = await ExpensesMaster.findById(expensesId);
//     if (!expensesMaster) {
//       return res.status(404).json({ message: "Expenses Master not found" });
//     }

//     const existingExpense = await ChildExpenses.findOne({ userId, expensesId });

//     if (existingExpense) {
//       const titleExists = existingExpense.category.some((cat) => cat === title);

//       if (titleExists && (!id || existingExpense._id.toString() !== id)) {
//         return res.status(409).json({
//           message: `The title '${title}' already exists in the category list for this user.`,
//         });
//       }
//     }

//     if (id) {
//       const updatedExpense = await ChildExpenses.findByIdAndUpdate(
//         id,
//         { userId, expensesId, category, title },
//         { new: true, upsert: true }
//       );

//       return res.status(200).json({
//         message: "ChildExpense Updated Successfully",
//         data: updatedExpense,
//       });
//     } else {
//       const newChildExpense = new ChildExpenses({
//         userId,
//         expensesId,
//         category,
//         title,
//       });

//       await newChildExpense.save();

//       return res.status(201).json({
//         message: "ChildExpense Added Successfully",
//         data: newChildExpense,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// exports.getAll = async (req, res) => {
//   //#swagger.tags = ['Child-Expenses']
//   const { userId } = req.params;

//   try {
//     const childExpenses = await ChildExpenses.find({ userId })
//       .populate("userId")
//       .populate("expensesId");

//     if (!childExpenses.length) {
//       return res.status(404).json({
//         message: "No expenses found for this user",
//       });
//     }

//     return res.status(200).json({
//       message: "Expenses retrieved successfully",
//       data: childExpenses,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

const ChildExpenses = require("../Model/ChildExpensesModel");
const User = require("../Model/emailModel");
const ExpensesMaster = require("../Model/expensesModel");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { id,  expensesId, category} = req.body;

  try {
    ``

    const expensesMaster = await ExpensesMaster.findById(expensesId);
    if (!expensesMaster) {
      return res.status(404).json({ message: "Expenses Master not found" });
    }

    const existingExpense = await ChildExpenses.findOne({ expensesId });

    if (existingExpense) {
      const titleExists = existingExpense.category.some((cat) => cat === title);

      if (titleExists && (!id || existingExpense._id.toString() !== id)) {
        return res.status(409).json({
          message: `The title '${title}' already exists in the category list for this user.`,
        });
      }
    }

    if (id) {
      const updatedExpense = await ChildExpenses.findByIdAndUpdate(
        id,
        {  expensesId, category },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        message: "ChildExpense Updated Successfully",
        data: updatedExpense,
      });
    } else {
      const newChildExpense = new ChildExpenses({
        
        expensesId,
        category,
        
      });

      await newChildExpense.save();

      return res.status(201).json({
        message: "ChildExpense Added Successfully",
        data: newChildExpense,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
    //#swagger.tags = ['Child-Expenses']
    try {
      const expenses = await ChildExpenses.find();
      res.status(200).json({
        statusCode: '0',
        message: "Expenses data retrived Successfully",
        data: expenses,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: '1',
        message: "Failed to retrived expenses data",
      });
    }
  };

  exports.deleteById = async (req, res) => {
    //#swagger.tags = ['Child-Expenses']
    try {
      const expenses = await ChildExpenses.findOne({ _id: req.params.expenses_id });
      if (expenses) {
        await ChildExpenses.deleteOne({ _id: req.params.expenses_id });
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