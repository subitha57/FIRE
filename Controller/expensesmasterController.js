const ExpensesMaster = require("../Model/expensesModel");
const ChildExpenses = require("../Model/ChildExpensesModel");

// exports.upsertExpense = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   const { id, title } = req.body;
//   try {
//     if (id) {
//       const updatedExpense = await ExpensesMaster.findByIdAndUpdate(
//         id,
//         { title, active: true }, // Set active to true when updating
//         { new: true, upsert: true }
//       );
//       res.status(201).json({
//         statusCode: "0",
//         data: updatedExpense,
//         message: "MasterExpenses Updated Successfully",
//       });
//     } else {
//       const newExpensesMaster = await new ExpensesMaster({ title, active: true }).save(); // Set active to true when adding new
//       res.status(201).json({
//         statusCode: "0",
//         data: newExpensesMaster,
//         message: "MasterExpenses Added Successfully",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ statusCode: "1", message: error.message });
//   }
// };

// exports.getAll = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   try {
//     const expenses = await ExpensesMaster.find();
//     res.status(200).json({
//       statusCode: "0",
//       message: "Expenses data retrived Successfully",
//       data: expenses,
//     });
//   } catch (error) {
//     res.status(500).json({
//       statusCode: "1",
//       message: "Failed to retrived expenses data",
//     });
//   }
// };

// exports.getById = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   try {
//     const expenses = await ExpensesMaster.findOne({
//       _id: req.params.expenses_id,
//     });
//     if (expenses) {
//       res.status(201).json({
//         statusCode: "0",
//         message: "expenses Id retrived successfully",
//         data: expenses,
//       });
//     } else {
//       res.status(200).json({
//         message: "expenses Id not found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to retrived expenses data",
//     });
//   }
// };

// exports.deleteById = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   try {
//     const expenses = await ExpensesMaster.findById(req.params.expenses_id);

//     if (expenses) {
//       await ChildExpenses.deleteMany({ expensesId: req.params.expenses_id });

//       await ExpensesMaster.findByIdAndDelete(req.params.expenses_id);

//       res.status(201).json({
//         message: "Expenses data and related ChildExpenses deleted successfully",
//       });
//     } else {
//       res.status(404).json({
//         message: "No expenses data found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete expenses",
//       error: error.message,
//     });
//   }
// };


exports.upsertExpense = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  const { id, title } = req.body;
  try {
    if (id) {
      const updatedExpense = await ExpensesMaster.findByIdAndUpdate(
        id,
        { title, active: true }, // Set active to true when updating
        { new: true, upsert: true }
      );
      res.status(201).json({
        statusCode: "0",
        data: updatedExpense,
        message: "MasterExpenses Updated Successfully",
      });
    } else {
      const newExpensesMaster = await new ExpensesMaster({ title, active: true }).save(); // Set active to true when adding new
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
    const expenses = await ExpensesMaster.find({ active: true }); // Only retrieve active expenses
    res.status(200).json({
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

exports.getById = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.findOne({
      _id: req.params.expenses_id,
      active: true, // Check if the expense is active
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
      // Instead of deleting, mark the expense as inactive
      expenses.active = false; // Set active to false
      await expenses.save(); // Save the changes

      // Optionally, delete related child expenses if required
      await ChildExpenses.deleteMany({ expensesId: req.params.expenses_id });

      res.status(200).json({
        message: "Expenses data marked as deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "No expenses data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete expenses",
      error: error.message,
    });
  }
};