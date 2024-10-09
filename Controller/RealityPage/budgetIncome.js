const Income = require("../../Model/Reality/budgetIncomeModel");
const User = require("../../Model/emailModel");

exports.createIncome = async (req, res) => {
  //#swagger.tags = ['Reality-IncomeSource']
  const { userId, month, year, date, income, otherIncome } = req.body;

  if (
    !userId ||
    !month ||
    !year ||
    !date ||
    !income ||
    !Array.isArray(otherIncome)
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required, and otherIncome should be an array.",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const existingIncome = await Income.findOne({ userId, month, year });
    if (existingIncome) {
      return res.status(200).json({
        success: false,
        message: "Income for this month and year already exists.",
      });
    }

    const validOtherIncome = otherIncome.map((item) => parseFloat(item) || 0);

    const totalOtherIncome = validOtherIncome.reduce((acc, value) => {
      return acc + value;
    }, 0);

    const totalIncomeValue =
      parseFloat(income.replace(/,/g, "")) + totalOtherIncome;

    const newIncome = new Income({
      userId,
      month,
      year,
      date,
      income,
      otherIncome: validOtherIncome,
      totalIncome: totalIncomeValue.toString(),
    });

    await newIncome.save();

    return res.status(201).json({
      success: true,
      message: "Reality income data stored successfully",
      _id: newIncome._id,
      userId: newIncome.userId,
      month: newIncome.month,
      year: newIncome.year,
      date: newIncome.date,
      income: newIncome.income,
      otherIncome: newIncome.otherIncome,
      totalIncome: newIncome.totalIncome,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getIncomeById = async (req, res) => {
  //#swagger.tags = ['Reality-IncomeSource']
  const { id } = req.params;

  try {
    const income = await Income.findById(id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    return res.status(201).json({
      success: true,
      data: income,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateIncome = async (req, res) => {
  //#swagger.tags = ['Reality-IncomeSource']
  const { id } = req.params;
  const { income, otherIncome } = req.body;

  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { income, otherIncome },
      { new: true, runValidators: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    return res.status(201).json({
      success: true,
      message: "Income updated successfully",
      data: updatedIncome,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteIncome = async (req, res) => {
  //#swagger.tags = ['Reality-IncomeSource']
  const { id } = req.params;

  try {
    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    return res.status(201).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.viewIncome = async (req, res) => {
  //#swagger.tags = ['Reality-IncomeSource']
  const { userId, month, year } = req.query;

  try {
    const incomes = await Income.find({ userId, month, year });

    if (incomes.length === 0) {
      return res.status(404).json({
        message:
          "No income found for this user in the specified month and year",
      });
    }

    return res.status(201).json({
      success: true,
      data: incomes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
