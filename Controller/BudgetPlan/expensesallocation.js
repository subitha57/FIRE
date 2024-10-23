const User = require("../../Model/emailModel");
const ExpensesMaster = require("../../Model/expensesModel");
const ExpensesAllocation = require("../../Model/ExpensesAllocation");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const { userId, titles } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statuscode: "1",
        message: "User not found",
      });
    }

    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    const currentYear = new Date().getFullYear();

    const existingAllocation = await ExpensesAllocation.findOne({
      userId,
      month: currentMonth,
      year: currentYear,
    });

    let updatedTitles = [];

    // If titles are provided in the request body
    if (titles && titles.length > 0) {
      // If there's an existing allocation, get its titles
      if (existingAllocation) {
        const existingTitles = existingAllocation.titles;

        // Create a map for quick access
        const existingTitlesMap = existingTitles.reduce((acc, title) => {
          acc[title.title] = title.amount; // Map title name to its amount
          return acc;
        }, {});

        // Update only the specified titles and keep others as they are
        updatedTitles = titles.map((title) => ({
          title: title.title,
          amount: title.amount !== undefined ? title.amount : existingTitlesMap[title.title] || 0,
        }));
      } else {
        // If no existing allocation, use provided titles
        updatedTitles = titles.map((title) => ({
          title: title.title,
          amount: title.amount || 0,
        }));
      }
    } else {
      // If no titles are provided, fetch active expenses from ExpensesMaster
      const expensesMaster = await ExpensesMaster.find({ userId: userId });

      updatedTitles = expensesMaster
        .filter((expense) => expense.active)
        .map((expense) => ({
          title: expense.title,
          amount: 0,
        }));

      if (updatedTitles.length === 0) {
        return res.status(404).json({
          statuscode: "1",
          message: "No active expenses found for this user",
        });
      }
    }

    const updateData = {
      userId: user._id,
      month: currentMonth,
      year: currentYear,
      titles: updatedTitles,
    };

    const updatedOrCreatedAllocation = await ExpensesAllocation.findOneAndUpdate(
      { userId: user._id, month: currentMonth, year: currentYear },
      { $set: updateData },
      { new: true, upsert: true }
    );

    const totalExpenses = updatedTitles.reduce((acc, title) => acc + title.amount, 0);

    const response = {
      statuscode: "0",
      message: existingAllocation
        ? "Expenses Allocation updated successfully"
        : "Expenses Allocation created successfully",
      userId: user._id,
      expensesAllocationId: updatedOrCreatedAllocation._id,
      Expenses: [
        {
          month: currentMonth,
          year: currentYear,
        },
        {
          titles: updatedOrCreatedAllocation.titles,
          totalExpenses: totalExpenses, // Add total expenses to response
        },
      ],
    };

    return res.status(201).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};



exports.getAll = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const allocations = await ExpensesAllocation.find();
    return res.status(200).json({
      statuscode: "0",
      message: "Expenses Allocations fetched successfully",
      data: allocations,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getById = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  const { userId, month, year } = req.params;

  try {
    const allocation = await ExpensesAllocation.findOne({
      userId,
      month,
      year,
    });
    
    if (!allocation) {
      return res.status(404).json({
        statuscode: "1",
        message: "Expenses Allocation not found",
      });
    }

    return res.status(200).json({
      statuscode: "0",
      message: "Expenses Allocation fetched successfully",
      data: allocation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};



exports.delete = async (req, res) => {
  const { allocationId } = req.params;

  try {
    const allocation = await ExpensesAllocation.findByIdAndDelete(allocationId);
    if (!allocation) {
      return res.status(404).json({
        statuscode: "1",
        message: "Expenses Allocation not found",
      });
    }

    res.status(200).json({
      statuscode: "0",
      message: "Expenses Allocation deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.delete = async (req, res) => {
  const { allocationId } = req.params;

  try {
    const allocation = await ExpensesAllocation.findByIdAndDelete(allocationId);
    if (!allocation) {
      return res.status(404).json({
        statuscode: "1",
        message: "Expenses Allocation not found",
      });
    }

    res.status(200).json({
      statuscode: "0",
      message: "Expenses Allocation deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};
