// const ExpensesAllocation = require("../../Model/personalModel");
// const User = require("../../Model/emailModel");

// const formatAmount = (amount) => {
//   return new Intl.NumberFormat("en-IN").format(amount);
// };

// exports.Create = async (req, res) => {
//   //#swagger.tags = ['User-Expenses Allocation']
//   try {
//     const {
//       month,
//       year,
//       housing,
//       entertainment,
//       transportation,
//       loans,
//       insurance,
//       taxes,
//       food,
//       savingsAndInvestments,
//       pets,
//       giftsAndDonations,
//       personalCare,
//       legal,
//       userId,
//     } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const monthNames = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];

//     let currentMonthIndex = monthNames.indexOf(month);
//     if (currentMonthIndex === -1) {
//       return res.status(400).json({ message: "Invalid month provided" });
//     }

//     const totalExpenses =
//       Number(housing) +
//       Number(entertainment) +
//       Number(transportation) +
//       Number(loans) +
//       Number(insurance) +
//       Number(taxes) +
//       Number(food) +
//       Number(savingsAndInvestments) +
//       Number(pets) +
//       Number(giftsAndDonations) +
//       Number(personalCare) +
//       Number(legal);

//     const createdBudgets = [];

//     for (let i = currentMonthIndex; i < 12; i++) {
//       const futureMonth = monthNames[i];

//       const existingBudget = await ExpensesAllocation.findOne({
//         month: futureMonth,
//         year,
//         userId,
//       });

//       if (existingBudget) {
//         continue;
//       }

//       const newBudget = new ExpensesAllocation({
//         month: futureMonth,
//         year,
//         categories: {
//           housing,
//           entertainment,
//           transportation,
//           loans,
//           insurance,
//           taxes,
//           food,
//           savingsAndInvestments,
//           pets,
//           giftsAndDonations,
//           personalCare,
//           legal,
//           totalExpenses,
//         },
//         userId,
//       });

//       await newBudget.save();
//       createdBudgets.push(newBudget);
//     }

//     if (createdBudgets.length === 0) {
//       return res.status(400).json({
//         message: "Budgets for all months in the year already exist",
//       });
//     }

//     return res.status(201).json({
//       message: "Expenses Allocation entries created successfully",
//       budgets: createdBudgets.map((budget) => ({
//         id: budget._id,
//         month: budget.month,
//         year: budget.year,
//         categories: {
//           housing: formatAmount(budget.categories.housing),
//           entertainment: formatAmount(budget.categories.entertainment),
//           transportation: formatAmount(budget.categories.transportation),
//           loans: formatAmount(budget.categories.loans),
//           insurance: formatAmount(budget.categories.insurance),
//           taxes: formatAmount(budget.categories.taxes),
//           food: formatAmount(budget.categories.food),
//           savingsAndInvestments: formatAmount(
//             budget.categories.savingsAndInvestments
//           ),
//           pets: formatAmount(budget.categories.pets),
//           giftsAndDonations: formatAmount(budget.categories.giftsAndDonations),
//           personalCare: formatAmount(budget.categories.personalCare),
//           legal: formatAmount(budget.categories.legal),
//           totalExpenses: formatAmount(budget.categories.totalExpenses),
//         },
//         userId: budget.userId,
//       })),
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to create budget entry",
//       error: error.message,
//     });
//   }
// };

const ExpensesAllocation = require("../../Model/personalModel");
const User = require("../../Model/emailModel");
const ExpensesMaster = require("../../Model/expensesModel"); // Import Master Expenses model

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

exports.Create = async (req, res) => {
  try {
    const { month, year, userId } = req.body;

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Fetch all active titles from ExpensesMaster
    const expensesTitles = await ExpensesMaster.find({ active: true }).select('title');
    if (expensesTitles.length === 0) {
      return res.status(400).json({
        message: "No active expense categories found",
      });
    }

    // Prepare a dynamic categories object from request body based on titles from ExpensesMaster
    const dynamicCategories = {};
    expensesTitles.forEach(({ title }) => {
      // Use the title as the key and retrieve its value from the request body
      dynamicCategories[title] = req.body[title] || 0; // Default to 0 if not provided in the request body
    });

    // Calculate total expenses dynamically
    const totalExpenses = Object.values(dynamicCategories).reduce((sum, value) => sum + Number(value), 0);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let currentMonthIndex = monthNames.indexOf(month);
    if (currentMonthIndex === -1) {
      return res.status(400).json({ message: "Invalid month provided" });
    }

    const createdBudgets = [];

    for (let i = currentMonthIndex; i < 12; i++) {
      const futureMonth = monthNames[i];

      // Check if a budget for the current month and year already exists
      const existingBudget = await ExpensesAllocation.findOne({
        month: futureMonth,
        year,
        userId,
      });

      if (existingBudget) {
        continue;
      }

      // Create a new budget entry
      const newBudget = new ExpensesAllocation({
        month: futureMonth,
        year,
        categories: {
          ...dynamicCategories,
        },
        totalExpenses,  // Ensure totalExpenses is stored
        userId,
      });

      await newBudget.save();
      createdBudgets.push(newBudget);
    }

    if (createdBudgets.length === 0) {
      return res.status(400).json({
        message: "Budgets for all months in the year already exist",
      });
    }

    return res.status(201).json({
      message: "Expenses Allocation entries created successfully",
      budgets: createdBudgets.map((budget) => ({
        id: budget._id,
        month: budget.month,
        year: budget.year,
        categories: {
          ...Object.keys(budget.categories).reduce((formatted, key) => {
            formatted[key] = budget.categories[key];
            return formatted;
          }, {}),
        },
        totalExpenses: budget.totalExpenses,  // Include totalExpenses in the response
        userId: budget.userId,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create budget entry",
      error: error.message,
    });
  }
};


exports.getById = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { id } = req.params;
    const budget = await ExpensesAllocation.findById(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.status(200).json({
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve budget",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { id } = req.params;
    const {
      month,
      year,
      housing,
      entertainment,
      transportation,
      loans,
      insurance,
      taxes,
      food,
      savingsAndInvestments,
      pets,
      giftsAndDonations,
      personalCare,
      legal,
      userId,
    } = req.body;

    const budget = await ExpensesAllocation.findById(id);

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    // Check if the userId matches the userId of the budget entry
    if (budget.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You cannot update this budget",
      });
    }

    // Calculate the updated total expenses
    const totalExpenses =
      Number(housing) +
      Number(entertainment) +
      Number(transportation) +
      Number(loans) +
      Number(insurance) +
      Number(taxes) +
      Number(food) +
      Number(savingsAndInvestments) +
      Number(pets) +
      Number(giftsAndDonations) +
      Number(personalCare) +
      Number(legal);

    // Update the budget entry with the new data
    budget.month = month || budget.month;
    budget.year = year || budget.year;
    budget.categories.housing = housing || budget.categories.housing;
    budget.categories.entertainment = entertainment || budget.categories.entertainment;
    budget.categories.transportation = transportation || budget.categories.transportation;
    budget.categories.loans = loans || budget.categories.loans;
    budget.categories.insurance = insurance || budget.categories.insurance;
    budget.categories.taxes = taxes || budget.categories.taxes;
    budget.categories.food = food || budget.categories.food;
    budget.categories.savingsAndInvestments = savingsAndInvestments || budget.categories.savingsAndInvestments;
    budget.categories.pets = pets || budget.categories.pets;
    budget.categories.giftsAndDonations = giftsAndDonations || budget.categories.giftsAndDonations;
    budget.categories.personalCare = personalCare || budget.categories.personalCare;
    budget.categories.legal = legal || budget.categories.legal;
    budget.categories.totalExpenses = totalExpenses;

    await budget.save();

    return res.status(200).json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update budget",
      error: error.message,
    });
  }
};

exports.view = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { month, year, userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const budget = await ExpensesAllocation.findOne({ month, year, userId });
    if (!budget) {
      return res.status(200).json({
        message: "No budget found for the selected month and year",
      });
    }

    return res.status(201).json({
      id: budget._id,
      message: "Budget retrieved successfully",
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve budget",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { id } = req.params;
    const budget = await ExpensesAllocation.findByIdAndDelete(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete budget",
      error: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { userId, year } = req.query;

    let query = {};
    if (userId) {
      query.userId = userId;
    }
    if (year) {
      query.year = year;
    }

    const budgets = await ExpensesAllocation.find(query);

    if (!budgets || budgets.length === 0) {
      return res.status(200).json({
        message: "No budgets found for the given criteria",
      });
    }

    return res.status(200).json({
      message: "Budgets retrieved successfully",
      budgets,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve budgets",
      error: error.message,
    });
  }
};
