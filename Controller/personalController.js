const ExpensesAllocation = require("../Model/personalModel");
const User = require("../Model/emailModel");

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

exports.Create = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

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

    // Array to store all the created budgets
    const createdBudgets = [];

    // Iterate from the current month until December (in the same year)
    for (let i = currentMonthIndex; i < 12; i++) {
      const futureMonth = monthNames[i];

      // Check if a budget already exists for this month and year
      const existingBudget = await ExpensesAllocation.findOne({
        month: futureMonth,
        year,
        userId,
      });

      if (existingBudget) {
        continue; // If a budget already exists, skip to the next month
      }

      // Create and save a new budget entry for the current month
      const newBudget = new ExpensesAllocation({
        month: futureMonth,
        year,
        categories: {
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
          totalExpenses,
        },
        userId,
      });

      await newBudget.save();
      createdBudgets.push(newBudget); // Push the created budget into the array
    }

    // Check if any budget was created
    if (createdBudgets.length === 0) {
      return res.status(400).json({
        message: "Budgets for all months in the year already exist",
      });
    }

    // Return all created budgets in the response
    return res.status(201).json({
      message: "Expenses Allocation entries created successfully",
      budgets: createdBudgets.map((budget) => ({
        id: budget._id,
        month: budget.month,
        year: budget.year,
        categories: {
          housing: formatAmount(budget.categories.housing),
          entertainment: formatAmount(budget.categories.entertainment),
          transportation: formatAmount(budget.categories.transportation),
          loans: formatAmount(budget.categories.loans),
          insurance: formatAmount(budget.categories.insurance),
          taxes: formatAmount(budget.categories.taxes),
          food: formatAmount(budget.categories.food),
          savingsAndInvestments: formatAmount(budget.categories.savingsAndInvestments),
          pets: formatAmount(budget.categories.pets),
          giftsAndDonations: formatAmount(budget.categories.giftsAndDonations),
          personalCare: formatAmount(budget.categories.personalCare),
          legal: formatAmount(budget.categories.legal),
          totalExpenses: formatAmount(budget.categories.totalExpenses),
        },
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
    const { month, year, userId } = req.query;
    const {
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
    } = req.body;

    const budget = await ExpensesAllocation.findOne({ month, year, userId });
    if (!budget) {
      return res
        .status(404)
        .json({ message: "Budget not found for the selected month and year" });
    }

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

    budget.categories = {
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
      totalExpenses,
    };

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