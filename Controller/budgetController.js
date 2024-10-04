// const Budget = require("../Model/budgetModel");
// const PersonalBudget = require("../Model/personalModel");
// const User = require("../Model/emailModel");

// exports.Create = async (req, res) => {
//   //#swagger.tags = ['User-Budget']
//   try {
//     const { month, year, income, otherIncome, userId } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const existingBudget = await Budget.findOne({ month, year, userId });
//     if (existingBudget) {
//       return res.status(200).json({
//         message: "Budget entry already exists for this month and year",
//       });
//     }

//     const totalIncome = Number(income) + Number(otherIncome || 0);

//     const newBudget = new Budget({
//       month,
//       year,
//       income: Number(income),
//       otherIncome: Number(otherIncome || 0),
//       totalIncome,
//       userId,
//     });

//     await newBudget.save();

//     return res.status(201).json({
//       message: "Budget entry created successfully",
//       budget: newBudget,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to create budget entry",
//       error: error.message,
//     });
//   }
// };

// exports.getById = async (req, res) => {
//   //#swagger.tags = ['User-Budget']
//   try {
//     const { id } = req.params;

//     const budget = await Budget.findById(id);
//     if (!budget) {
//       return res.status(200).json({
//         message: "Budget not found",
//       });
//     }

//     return res.status(201).json({
//       message: "Budget retrieved successfully",
//       budget,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to retrieve budget",
//       error: error.message,
//     });
//   }
// };

// exports.View = async (req, res) => {
//   //#swagger.tags = ['User-Budget']
//   try {
//     const { month, year, userId } = req.query;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const budget = await Budget.findOne({ month, year, userId });
//     if (!budget) {
//       return res.status(200).json({
//         message: "No budget found for the selected month and year",
//       });
//     }

//     return res.status(201).json({
//       message: "Budget retrieved successfully",
//       budget,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to retrieve budget",
//       error: error.message,
//     });
//   }
// };

// exports.Update = async (req, res) => {
//   //#swagger.tags = ['User-Budget']
//   try {
//     const { id } = req.params;
//     const { month, year, income, otherIncome, userId } = req.body;

//     const budget = await Budget.findById(id);
//     if (!budget) {
//       return res.status(404).json({
//         message: "Budget not found",
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const totalIncome = Number(income) + Number(otherIncome || 0);

//     const updatedBudget = await Budget.findByIdAndUpdate(
//       id,
//       {
//         month,
//         year,
//         income: Number(income),
//         otherIncome: Number(otherIncome || 0),
//         totalIncome,
//         userId,
//       },
//       { new: true }
//     );

//     return res.status(201).json({
//       message: "Budget updated successfully",
//       budget: updatedBudget,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to update budget",
//       error: error.message,
//     });
//   }
// };

// exports.Delete = async (req, res) => {
//   //#swagger.tags = ['User-Budget']
//   try {
//     const { id } = req.params;

//     const budget = await Budget.findById(id);
//     if (!budget) {
//       return res.status(404).json({
//         message: "Budget not found",
//       });
//     }

//     await Budget.findByIdAndDelete(id);

//     return res.status(201).json({
//       message: "Budget deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to delete budget",
//       error: error.message,
//     });
//   }
// };

// exports.CalculateBudget = async (req, res) => {
//   //#swagger.tags = ['User-Budget']
//   try {
//     const { month, year, userId } = req.query;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const budget = await Budget.findOne({ month, year, userId });
//     if (!budget) {
//       return res.status(404).json({
//         message: "No budget found for the selected month and year",
//       });
//     }

//     const personalBudget = await PersonalBudget.findOne({
//       month,
//       year,
//       userId,
//     });
//     if (!personalBudget) {
//       return res.status(404).json({
//         message: "No personal budget found for the selected month and year",
//       });
//     }

//     const totalIncome = budget.totalIncome;
//     const totalExpenses = personalBudget.totalExpenses;

//     const remainingBalance = totalIncome - totalExpenses;

//     return res.status(200).json({
//       message: "Budget calculated successfully",
//       totalIncome,
//       totalExpenses,
//       remainingBalance,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to calculate budget",
//       error: error.message,
//     });
//   }
// };


const Budget = require("../Model/budgetModel");
const PersonalBudget = require("../Model/personalModel");
const User = require("../Model/emailModel");

// Create budget for a specific month and propagate income to future months
exports.Create = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { month, year, income, otherIncome, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if a budget already exists for the current month
    const existingBudget = await Budget.findOne({ month, year, userId });
    if (existingBudget) {
      return res.status(200).json({
        message: "Budget entry already exists for this month and year",
      });
    }

    const totalIncome = Number(income) + Number(otherIncome || 0);

    // Create the budget for the current month
    const newBudget = new Budget({
      month,
      year,
      income: Number(income),
      otherIncome: Number(otherIncome || 0),
      totalIncome,
      userId,
    });

    await newBudget.save();

    // Automatically create or update budgets for future months
    const currentYear = new Date().getFullYear();

    for (let futureYear = year; futureYear <= currentYear + 5; futureYear++) {
      const startMonth = futureYear === year ? month + 1 : 1;

      for (let futureMonth = startMonth; futureMonth <= 12; futureMonth++) {
        const futureBudget = await Budget.findOne({
          month: futureMonth,
          year: futureYear,
          userId,
        });

        if (!futureBudget) {
          const budgetForFutureMonth = new Budget({
            month: futureMonth,
            year: futureYear,
            income: Number(income),
            otherIncome: Number(otherIncome || 0),
            totalIncome,
            userId,
          });

          await budgetForFutureMonth.save();
        }
      }
    }

    return res.status(201).json({
      message: "Budget entry created and propagated successfully",
      budget: newBudget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create budget entry",
      error: error.message,
    });
  }
};

// Get budget by ID
exports.getById = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(200).json({
        message: "Budget not found",
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

// View budget by month, year, and userId
exports.View = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { month, year, userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const budget = await Budget.findOne({ month, year, userId });
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

// Update budget with an option to propagate changes to future months
exports.Update = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { id } = req.params;
    const { month, year, income, otherIncome, userId, propagate } = req.body;

    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const totalIncome = Number(income) + Number(otherIncome || 0);

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {
        month,
        year,
        income: Number(income),
        otherIncome: Number(otherIncome || 0),
        totalIncome,
        userId,
      },
      { new: true }
    );

    // If the user chooses to propagate changes to future months
    if (propagate) {
      const currentYear = new Date().getFullYear();

      for (let futureYear = year; futureYear <= currentYear + 5; futureYear++) {
        const startMonth = futureYear === year ? month + 1 : 1;

        for (let futureMonth = startMonth; futureMonth <= 12; futureMonth++) {
          const futureBudget = await Budget.findOne({
            month: futureMonth,
            year: futureYear,
            userId,
          });

          if (futureBudget) {
            await Budget.findByIdAndUpdate(futureBudget._id, {
              income: Number(income),
              otherIncome: Number(otherIncome || 0),
              totalIncome,
            });
          } else {
            const budgetForFutureMonth = new Budget({
              month: futureMonth,
              year: futureYear,
              income: Number(income),
              otherIncome: Number(otherIncome || 0),
              totalIncome,
              userId,
            });

            await budgetForFutureMonth.save();
          }
        }
      }
    }

    return res.status(201).json({
      message: "Budget updated successfully",
      budget: updatedBudget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update budget",
      error: error.message,
    });
  }
};

// Delete a budget entry by ID
exports.Delete = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    await Budget.findByIdAndDelete(id);

    return res.status(201).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete budget",
      error: error.message,
    });
  }
};

// Calculate remaining balance by subtracting expenses from total income
exports.CalculateBudget = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { month, year, userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const budget = await Budget.findOne({ month, year, userId });
    if (!budget) {
      return res.status(404).json({
        message: "No budget found for the selected month and year",
      });
    }

    const personalBudget = await PersonalBudget.findOne({
      month,
      year,
      userId,
    });
    if (!personalBudget) {
      return res.status(404).json({
        message: "No personal budget found for the selected month and year",
      });
    }

    const totalIncome = budget.totalIncome;
    const totalExpenses = personalBudget.totalExpenses;

    const remainingBalance = totalIncome - totalExpenses;

    return res.status(200).json({
      message: "Budget calculated successfully",
      totalIncome,
      totalExpenses,
      remainingBalance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to calculate budget",
      error: error.message,
    });
  }
};
