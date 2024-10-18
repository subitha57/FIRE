const ChildExpenses = require("../Model/ChildExpensesModel");
const ExpensesMaster = require("../Model/expensesModel");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  try {
    const { id, expensesId, category } = req.body;

    if (!expensesId || !category || !Array.isArray(category)) {
      return res
        .status(200)
        .json({ message: "ExpensesId and category (array) are required" });
    }

    const existingChildExpense = await ChildExpenses.findOne({ expensesId });

    if (existingChildExpense) {
      const existingCategories = existingChildExpense.category;

      const duplicates = category.filter((cat) =>
        existingCategories.includes(cat)
      );

      if (duplicates.length > 0) {
        return res.status(200).json({
          message: `Category(ies) [${duplicates.join(
            ", "
          )}] already exist(s) in ChildExpenses`,
        });
      }

      const updatedCategories = [...existingCategories, ...category];

      existingChildExpense.category = updatedCategories;
      await existingChildExpense.save();

      const populatedExpense = await existingChildExpense.populate(
        "expensesId",
        "title"
      );

      return res.status(201).json({
        message: "ChildExpenses updated successfully with new categories",
        data: populatedExpense,
      });
    }

    const newChildExpense = new ChildExpenses({
      expensesId,
      category,
    });

    const savedExpense = await newChildExpense.save();

    const populatedExpense = await savedExpense.populate("expensesId", "title");

    return res.status(201).json({
      message: "ChildExpenses created successfully",
      data: populatedExpense,
    });
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

    return res.status(201).json({
      message: "ChildExpenses fetched successfully",
      data: childExpenses,
    });
  } catch (error) {
    console.error("Error in fetching child expenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(200).json({ message: "ChildExpenses ID is required" });
    }

    const deletedExpense = await ChildExpenses.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(200).json({ message: "ChildExpenses not found" });
    }

    return res.status(201).json({
      message: "ChildExpenses deleted successfully",
      data: deletedExpense,
    });
  } catch (error) {
    console.error("Error in deleting child expenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.search = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const query = req.query.query; // Get the search term from query parameters

  try {
    const childExpenses = await ChildExpenses.find({
      category: { $regex: query, $options: "i" }, // Case-insensitive search
    }).populate("expensesId", "title");

    return res.status(200).json({
      message: "ChildExpenses retrieved successfully",
      data: childExpenses,
    });
  } catch (error) {
    console.error("Error in searching child expenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
