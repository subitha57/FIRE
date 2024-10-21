const ExpensesAllocation = require("../../Model/ExpensesAllocation");
const User = require("../../Model/emailModel");
const ExpensesMaster = require("../../Model/expensesModel");

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

// exports.Create = async (req, res) => {
//   //#swagger.tags = ['User-Expenses Allocation']
//   try {
//     const { month, year, userId } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(200).json({ status: 0, message: "User not found" });
//     }

//     const activeExpenses = await ExpensesMaster.find({ active: true }).select("title");
//     if (activeExpenses.length === 0) {
//       return res.status(200).json({ status: 0, message: "No active expense categories found" });
//     }

//     const dynamicCategories = {};
//     activeExpenses.forEach(({ title }) => {
//       const amount = req.body[title] || 0;
//       if (amount < 0) {
//         return res.status(200).json({ status: 0, message: `Invalid amount for ${title}` });
//       }
//       dynamicCategories[title] = amount; // Ensure you capture the amount for each category
//     });

//     const totalExpenses = Object.values(dynamicCategories).reduce((sum, value) => sum + Number(value), 0);

//     const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//     const currentMonthIndex = monthNames.indexOf(month);
//     if (currentMonthIndex === -1) {
//       return res.status(200).json({ status: 0, message: "Invalid month provided" });
//     }

//     const createdBudgets = [];
//     for (let i = currentMonthIndex; i < 12; i++) {
//       const futureMonth = monthNames[i];
//       const existingBudget = await ExpensesAllocation.findOne({ month: futureMonth, year, userId });
//       if (existingBudget) continue;

//       const newBudget = new ExpensesAllocation({
//         month: futureMonth,
//         year,
//         categories: { ...dynamicCategories }, // Assign dynamic categories with amounts
//         totalExpenses,
//         userId,
//       });

//       await newBudget.save();
//       createdBudgets.push(newBudget);
//     }

//     if (createdBudgets.length === 0) {
//       return res.status(200).json({
//         status: 0,
//         message: "Budgets for all months in the year already exist",
//       });
//     }

//     return res.status(201).json({
//       status: 1,
//       message: "Expenses Allocation entries created successfully",
//       budgets: createdBudgets.map((budget) => ({
//         id: budget._id,
//         month: budget.month,
//         year: budget.year,
//         categories: budget.categories,
//         totalExpenses: budget.totalExpenses,
//         userId: budget.userId,
//       })),
//     });
//   } catch (error) {
//     return res.status(200).json({
//       status: 0,
//       message: "Failed to create budget entry",
//       error: error.message,
//     });
//   }
// };

exports.Create = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { month, year, userId } = req.body;

    // Fetch active expense categories from ExpensesMaster (assuming this schema exists)
    const activeExpenses = await ExpensesMaster.find({ active: true });

    // Dynamically create categories object from the request body
    const dynamicCategories = {};
    activeExpenses.forEach(({ title }) => {
      dynamicCategories[title] = req.body[title] || 0; // Assign the amount from req.body, default to 0 if missing
    });

    // Calculate total expenses by summing the category amounts
    const totalExpenses = Object.values(dynamicCategories).reduce(
      (sum, value) => sum + Number(value),
      0
    );

    // Create a new expense allocation entry
    const newExpenseAllocation = new ExpenseAllocation({
      month,
      year,
      userId,
      categories: dynamicCategories,
      totalExpenses
    });

    // Save the entry to the database
    await newExpenseAllocation.save();

    return res.status(201).json({
      status: 1,
      message: "Expenses Allocation entries created successfully",
      budgets: [newExpenseAllocation]
    });

  } catch (error) {
    console.error("Error creating expenses allocation:", error);
    return res.status(500).json({ status: 0, message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const allocations = await ExpensesAllocation.find();
    return res.status(200).json({
      status: 1,
      message: "Expenses Allocation entries fetched successfully",
      allocations,
    });
  } catch (error) {
    return res.status(200).json({
      status: 0,
      message: "Failed to fetch expenses allocation entries",
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { id } = req.params;
    const allocation = await ExpensesAllocation.findById(id);

    if (!allocation) {
      return res
        .status(200)
        .json({ status: 0, message: "Expenses Allocation entry not found" });
    }

    return res.status(200).json({
      status: 1,
      message: "Expenses Allocation entry fetched successfully",
      allocation,
    });
  } catch (error) {
    return res.status(200).json({
      status: 0,
      message: "Failed to fetch expenses allocation entry",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedAllocation = await ExpensesAllocation.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedAllocation) {
      return res.status(200).json({
        status: 0,
        message: "Failed to update Expenses Allocation entry",
      });
    }

    return res.status(201).json({
      status: 1,
      message: "Expenses Allocation entry updated successfully",
      allocation: updatedAllocation,
    });
  } catch (error) {
    return res.status(200).json({
      status: 0,
      message: "Failed to update expenses allocation entry",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { id } = req.params;

    const deletedAllocation = await ExpensesAllocation.findByIdAndDelete(id);

    if (!deletedAllocation) {
      return res.status(200).json({
        status: 0,
        message: "Failed to delete Expenses Allocation entry",
      });
    }

    return res.status(201).json({
      status: 1,
      message: "Expenses Allocation entry deleted successfully",
    });
  } catch (error) {
    return res.status(200).json({
      status: 0,
      message: "Failed to delete expenses allocation entry",
      error: error.message,
    });
  }
};

exports.view = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { month, year, userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ status: 0, message: "User not found" });
    }

    const allocation = await ExpensesAllocation.findOne({
      month,
      year,
      userId,
    });

    if (!allocation) {
      return res
        .status(200)
        .json({
          status: 0,
          message:
            "No expenses allocation found for the specified month and year",
        });
    }

    return res.status(200).json({
      status: 1,
      message: "Expenses Allocation entry fetched successfully",
      allocation,
    });
  } catch (error) {
    return res.status(200).json({
      status: 0,
      message: "Failed to fetch expenses allocation entry",
      error: error.message,
    });
  }
};
