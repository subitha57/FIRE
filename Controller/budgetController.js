
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

//     const monthsOfYear = [
//       "January", "February", "March", "April", "May", "June",
//       "July", "August", "September", "October", "November", "December"
//     ];

//     const startMonthIndex = monthsOfYear.indexOf(month);

//     for (let i = startMonthIndex + 1; i < monthsOfYear.length; i++) {
//       const futureMonth = monthsOfYear[i];

//       const futureBudget = await Budget.findOne({
//         month: futureMonth,
//         year,
//         userId,
//       });

//       if (!futureBudget) {
//         const budgetForFutureMonth = new Budget({
//           month: futureMonth,
//           year,
//           income: Number(income),
//           otherIncome: 0,
//           totalIncome: Number(income),
//           userId,
//         });

//         await budgetForFutureMonth.save();
//       }
//     }

//     return res.status(201).json({
//       message: "Budget entry created and propagated for the year successfully",
//       budget: newBudget,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to create budget entry",
//       error: error.message,
//     });
//   }
// };

// // Update Budget
// exports.Update = async (req, res) => {
//   //#swagger.tags = ['User-Budget']
//   try {
//     const { id } = req.params;
//     const { month, year, income, otherIncome, userId, propagate } = req.body;

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

//     if (propagate) {
//       const monthsOfYear = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//       ];

//       const startMonthIndex = monthsOfYear.indexOf(month);

//       for (let i = startMonthIndex + 1; i < monthsOfYear.length; i++) {
//         const futureMonth = monthsOfYear[i];

//         const futureBudget = await Budget.findOne({
//           month: futureMonth,
//           year,
//           userId,
//         });

//         if (futureBudget) {
//           await Budget.findByIdAndUpdate(futureBudget._id, {
//             income: Number(income),
//             otherIncome: futureBudget.otherIncome,
//             totalIncome: Number(income) + Number(futureBudget.otherIncome || 0),
//           });
//         }
//       }
//     }

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

// // Get Budget by ID
// exports.getById = async (req, res) => {
//   //#swagger.tags = ['User-Budget']
//   try {
//     const { id } = req.params;

//     const budget = await Budget.findById(id);
//     if (!budget) {
//       return res.status(404).json({
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

// // View Budget by Month, Year, and User
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
//       budget: {
//         income: budget.income,
//         otherIncome: budget.otherIncome,
//         totalIncome: budget.totalIncome,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to retrieve budget",
//       error: error.message,
//     });
//   }
// };

// // Delete Budget
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

// // Calculate Budget (Including Other Income)
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
//       income: budget.income,
//       otherIncome: budget.otherIncome,
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

exports.Create = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { month, year, income, otherIncome = [], userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingBudget = await Budget.findOne({ month, year, userId });
    if (existingBudget) {
      return res.status(200).json({
        message: "Budget entry already exists for this month and year",
      });
    }

    // Ensure otherIncome is an array with 10 elements, filling with empty strings if necessary
    const otherIncomeValues = otherIncome.slice(0, 10).concat(Array(10 - otherIncome.length).fill(''));
    const totalOtherIncome = otherIncomeValues.reduce((acc, curr) => acc + Number(curr), 0);
    const totalIncome = Number(income) + totalOtherIncome;

    const newBudget = new Budget({
      month,
      year,
      income: Number(income),
      otherIncome: otherIncomeValues,
      totalIncome,
      userId,
    });

    await newBudget.save();

    const monthsOfYear = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const startMonthIndex = monthsOfYear.indexOf(month);

    for (let i = startMonthIndex + 1; i < monthsOfYear.length; i++) {
      const futureMonth = monthsOfYear[i];

      const futureBudget = await Budget.findOne({
        month: futureMonth,
        year,
        userId,
      });

      if (!futureBudget) {
        const budgetForFutureMonth = new Budget({
          month: futureMonth,
          year,
          income: Number(income),
          otherIncome: otherIncomeValues, // Save default values for future months
          totalIncome,
          userId,
        });

        await budgetForFutureMonth.save();
      }
    }

    return res.status(201).json({
      message: "Budget entry created and propagated for the year successfully",
      budget: newBudget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create budget entry",
      error: error.message,
    });
  }
};

// Update Budget
exports.Update = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { id } = req.params;
    const { month, year, income, otherIncome = [], userId, propagate } = req.body;

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

    // Ensure otherIncome is an array with 10 elements, filling with empty strings if necessary
    const otherIncomeValues = otherIncome.slice(0, 10).concat(Array(10 - otherIncome.length).fill(''));
    const totalOtherIncome = otherIncomeValues.reduce((acc, curr) => acc + Number(curr), 0);
    const totalIncome = Number(income) + totalOtherIncome;

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {
        month,
        year,
        income: Number(income),
        otherIncome: otherIncomeValues,
        totalIncome,
        userId,
      },
      { new: true }
    );

    if (propagate) {
      const monthsOfYear = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const startMonthIndex = monthsOfYear.indexOf(month);

      for (let i = startMonthIndex + 1; i < monthsOfYear.length; i++) {
        const futureMonth = monthsOfYear[i];

        const futureBudget = await Budget.findOne({
          month: futureMonth,
          year,
          userId,
        });

        if (futureBudget) {
          await Budget.findByIdAndUpdate(futureBudget._id, {
            income: Number(income),
            otherIncome: futureBudget.otherIncome,
            totalIncome: Number(income) + Number(futureBudget.otherIncome.reduce((acc, curr) => acc + Number(curr), 0) || 0),
          });
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

// Get Budget by ID
exports.getById = async (req, res) => {
  //#swagger.tags = ['User-Budget']
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    return res.status(200).json({
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

// View Budget by Month, Year, and User
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

    return res.status(200).json({
      message: "Budget retrieved successfully",
      budget: {
        income: budget.income,
        otherIncome: budget.otherIncome,
        totalIncome: budget.totalIncome,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve budget",
      error: error.message,
    });
  }
};

// Delete Budget
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

// Calculate Budget (Including Other Income)
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
      income: budget.income,
      otherIncome: budget.otherIncome,
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
