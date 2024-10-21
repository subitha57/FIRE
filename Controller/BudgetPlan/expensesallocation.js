const ExpensesAllocation = require("../../Model/ExpensesAllocation");
const ExpensesMaster = require("../../Model/expensesModel");
const User = require("../../Model/emailModel");

const getCurrentMonthYear = () => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  return { month, year };
};

exports.Create = async (req, res) => {
  //#swagger.tags = ['User-ExpensesAllocation']
  try {
    const { userId } = req.body;
    const { month, year } = getCurrentMonthYear();

    const expensesMaster = await ExpensesMaster.find({ active: true });
    const titles = expensesMaster.map((item) => ({
      title: item.title,
      amount: 0,
    }));

    const newExpensesAllocation = new ExpensesAllocation({
      userId,
      month,
      year,
      titles,
    });

    const savedAllocation = await newExpensesAllocation.save();
    res.status(201).json({
      statusCode: "1",
      message: "Expenses allocation created successfully",
      _id: savedAllocation._id,
      expenses: {
        month: savedAllocation.month,
        year: savedAllocation.year,
        titles: savedAllocation.titles,
      },
    });
  } catch (err) {
    res.status(500).json({ statusCode: "0", message: err.message });
  }
};

exports.update = async (req, res) => {
   //#swagger.tags = ['User-ExpensesAllocation']
  try {
    const { id } = req.params;
    const { titles } = req.body;

    const existingAllocation = await ExpensesAllocation.findById(id);
    if (!existingAllocation) {
      return res
        .status(200)
        .json({ statusCode: "0", message: "Expenses allocation not found" });
    }

    const updatedTitles = existingAllocation.titles.map((existingTitle) => {
      const matchingTitle = titles.find((t) => t.title === existingTitle.title);
      if (matchingTitle) {
        return { ...existingTitle, amount: matchingTitle.amount };
      }
      return existingTitle;
    });

    existingAllocation.titles = updatedTitles;

    const updatedExpenses = await existingAllocation.save();

    res.status(201).json({
      statusCode: "1",
      message: "Expenses allocation updated successfully",
      _id: updatedExpenses._id,
      expenses: {
        month: updatedExpenses.month,
        year: updatedExpenses.year,
        titles: updatedExpenses.titles,
      },
    });
  } catch (err) {
    res.status(500).json({ statusCode: "0", message: err.message });
  }
};

exports.delete = async (req, res) => {
   //#swagger.tags = ['User-ExpensesAllocation']
  try {
    const { id } = req.params;

    const deletedExpenses = await ExpensesAllocation.findByIdAndDelete(id);
    if (!deletedExpenses) {
      return res
        .status(200)
        .json({ statusCode: "0", message: "Expenses allocation not found" });
    }

    res
      .status(201)
      .json({
        statusCode: "1",
        message: "Expenses allocation deleted successfully",
      });
  } catch (err) {
    res.status(500).json({ statusCode: "0", message: err.message });
  }
};

exports.getById = async (req, res) => {
   //#swagger.tags = ['User-ExpensesAllocation']
  try {
    const { id } = req.params;

    const expenses = await ExpensesAllocation.findById(id).populate(
      "userId",
      "email"
    );

    if (!expenses) {
      return res
        .status(200)
        .json({ statusCode: "0", message: "Expenses allocation not found" });
    }

    res.status(201).json({
      statusCode: "1",
      message: "Expenses allocation retrieved successfully",
      _id: expenses._id,
      expenses: {
        month: expenses.month,
        year: expenses.year,
        titles: expenses.titles,
      },
      userId: expenses.userId.email,
    });
  } catch (err) {
    res.status(500).json({ statusCode: "0", message: err.message });
  }
};

exports.getAll = async (req, res) => {
   //#swagger.tags = ['User-ExpensesAllocation']
  try {
    const expensesAllocations = await ExpensesAllocation.find();

    res.status(201).json({
      statusCode: "1",
      message: "Expenses allocations retrieved successfully",
      expenses: expensesAllocations,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "0",
      message: "Error retrieving expenses allocations",
      error: error.message,
    });
  }
};
