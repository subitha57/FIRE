const ChildExpenses = require("../Model/ChildExpensesModel");
const ExpensesMaster = require("../Model/expensesModel");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  try {
    const { id, expensesId, category } = req.body;

    // Validate that expensesId and category are provided
    if (!expensesId || !category) {
      return res
        .status(400)
        .json({ message: "ExpensesId and category are required" });
    }

    // Check if updating an existing ChildExpense
    if (id) {
      // Find and update the ChildExpense by id
      const updatedExpense = await ChildExpenses.findByIdAndUpdate(
        id,
        { expensesId, category },
        { new: true }  // Return the updated document
      ).populate("expensesId", "title");  // Populate title from ExpensesMaster

      // If the ChildExpense is found and updated, return success
      if (updatedExpense) {
        return res.status(200).json({
          message: "ChildExpenses updated successfully",
          data: updatedExpense,
        });
      } else {
        return res.status(404).json({ message: "ChildExpenses not found" });
      }
    } else {
      // Create a new ChildExpense if no id is provided
      const newChildExpense = new ChildExpenses({
        expensesId,
        category,
      });

      // Save the new ChildExpense
      const savedExpense = await newChildExpense.save();

      // Populate the title from the ExpensesMaster schema after saving
      const populatedExpense = await savedExpense.populate("expensesId", "title");

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
    // Fetch all ChildExpenses and populate title from ExpensesMaster
    const childExpenses = await ChildExpenses.find().populate(
      "expensesId",
      "title"
    );

    // Return success response with all child expenses
    return res.status(200).json({
      message: "ChildExpenses fetched successfully",
      data: childExpenses,
    });
  } catch (error) {
    console.error("Error in fetching child expenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
