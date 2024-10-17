const ChildExpenses = require("../Model/ChildExpensesModel");
const ExpensesMaster = require("../Model/expensesModel");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  try {
    const { id, expensesId, category } = req.body;

    if (!expensesId || !category) {
      return res
        .status(400)
        .json({ message: "ExpensesId and category are required" });
    }

    if (id) {
      const updatedExpense = await ChildExpenses.findByIdAndUpdate(
        id,
        { expensesId, category },
        { new: true }
      ).populate("expensesId", "title");

      if (updatedExpense) {
        return res.status(200).json({
          message: "ChildExpenses updated successfully",
          data: updatedExpense,
        });
      } else {
        return res.status(404).json({ message: "ChildExpenses not found" });
      }
    } else {
      const newChildExpense = new ChildExpenses({
        expensesId,
        category,
      });

      await newChildExpense.save();

      const populatedExpense = await newChildExpense
        .populate("expensesId", "title")
        .execPopulate();

      return res.status(201).json({
        message: "ChildExpenses created successfully",
        data: populatedExpense,
      });
    }
  } catch (error) {
    console.error("Error in upserting child expenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  try {
    const childExpenses = await ChildExpenses.find().populate(
      "expensesId",
      "title"
    );

    return res.status(200).json({
      message: "ChildExpenses fetched successfully",
      data: childExpenses,
    });
  } catch (error) {
    console.error("Error in fetching child expenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
