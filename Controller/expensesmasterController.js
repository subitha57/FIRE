// const ExpensesMaster = require("../Model/expensesModel");

// exports.createExpense = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   try {
//     const { serialNo, name } = req.body;

//     const existingSerialNo = await ExpensesMaster.findOne({ serialNo });
//     if (existingSerialNo) {
//       return res
//         .status(400)
//         .json({
//           message: "Serial number already exists, please use a different one",
//         });
//     }

//     const existingName = await ExpensesMaster.findOne({ name });
//     if (existingName) {
//       return res
//         .status(400)
//         .json({ message: "Expense with this name already exists" });
//     }

//     const newExpense = new ExpensesMaster({ serialNo, name });
//     await newExpense.save();
//     res
//       .status(201)
//       .json({ message: "Expense created successfully", newExpense });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating expense", error });
//   }
// };

// exports.getAllExpenses = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   try {
//     const expenses = await ExpensesMaster.find();
//     res.status(200).json(expenses);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching expenses", error });
//   }
// };

// exports.getExpenseById = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   try {
//     const expense = await ExpensesMaster.findById(req.params.id);
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }
//     res.status(200).json(expense);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching expense", error });
//   }
// };

// exports.updateExpense = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   try {
//     const { serialNo, name } = req.body;
//     const updatedExpense = await ExpensesMaster.findOneAndUpdate(
//       { name: req.params.name }, 
//       { serialNo, name }, 
//       { new: true }
//     );
//     if (!updatedExpense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }
//     res
//       .status(200)
//       .json({ message: "Expense updated successfully", updatedExpense });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating expense", error });
//   }
// };

// exports.deleteExpense = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   try {
//     const deletedExpense = await ExpensesMaster.findOneAndDelete({
//       name: req.params.name,
//     }); // Find by name
//     if (!deletedExpense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }
//     res.status(200).json({ message: "Expense deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting expense", error });
//   }
// };


const ExpensesMaster = require("../Model/expensesModel");
const User = require("../Model/emailModel");

exports.upsertExpense = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
    const { id, title, userId } = req.body;
    try {
      const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }
      if (id) {
        const updatedExpense = await ExpensesMaster.findByIdAndUpdate(id, { title,userId }, {new: true, upsert: true })
        res.status(200).json({ statusCode: '0', data: updatedExpense, message: 'MasterExpenses Updated Successfully' })
      } else {
        const newExpensesMaster = await new ExpensesMaster({ title,userId }).save();
        res.status(200).json({ statusCode: '0', data: newExpensesMaster, message: 'MasterExpenses Added Successfully' })
      }
    } catch (error) {
      res.status(500).json({ statusCode: '1', message: error.message })
    }
  }
  
exports.getAll = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.find();
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

exports.getById = async (req, res) => {
 //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.findOne({ _id: req.params.expenses_id });
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
    const expenses = await ExpensesMaster.findOne({ _id: req.params.expenses_id });
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


