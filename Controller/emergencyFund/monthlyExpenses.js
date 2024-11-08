// controllers/userSavingsController.js
const UserSavings = require('../../Model/monthlyExpenses/monthlyExpensesModel');
const User = require('../../Model/emailModel');

exports.create = async (req, res) => {
  const {userId, monthlyExpenses, emergencyFundMonths, monthlySavings } = req.body;


  try {
    // Validate input
    if (isNaN(monthlyExpenses) || isNaN(emergencyFundMonths) || isNaN(monthlySavings)) {
      return res.status(400).json({ error: 'monthlyExpenses, emergencyFundMonths, and monthlySavings must be valid numbers' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const totalEmergencyFund = monthlyExpenses * emergencyFundMonths;

    // Create a new UserSavings document
    const userSavings = new UserSavings({
      userId,
      monthlyExpenses,
      emergencyFundMonths,
      monthlySavings,
      totalEmergencyFund,
    });
    console.log('Saving document:', userSavings);
    await userSavings.save();

    const now = new Date();
    const responseDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1, // Months are zero-indexed
      date: now.getDate(),
      time: now.toLocaleTimeString(), // You can customize the format as needed
    };

    res.status(201).json({
      statusCode: 201,
      message: 'Financial plan saved successfully',
      data: {
        monthlyExpenses,
        emergencyFundMonths,
        monthlySavings,
        totalEmergencyFund,
      },
      responseDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while saving the financial plan'
    });
  }
};


exports.getAll = async (req, res) => {
  try {
    const userSavings = await UserSavings.find();

    if (!userSavings || userSavings.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'No financial plans found'
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Financial plans retrieved successfully',
      data: userSavings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while retrieving financial plans'
    });
  }
};

exports.upsert = async (req, res) => {
  const { userId, monthlyExpenses, emergencyFundMonths, monthlySavings } = req.body;

  try {
    // Validate input
    if (isNaN(monthlyExpenses) || isNaN(emergencyFundMonths) || isNaN(monthlySavings)) {
      return res.status(400).json({ error: 'monthlyExpenses, emergencyFundMonths, and monthlySavings must be valid numbers' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalEmergencyFund = monthlyExpenses * emergencyFundMonths;

    // Find and update or create a new UserSavings document if not found
    let userSavings = await UserSavings.findOneAndUpdate(
      { userId }, // filter by userId
      {
        monthlyExpenses,
        emergencyFundMonths,
        monthlySavings,
        totalEmergencyFund,
      },
      { new: true } // return the updated document
    );

    if (!userSavings) {
      // If not found, create a new record
      userSavings = new UserSavings({
        userId,
        monthlyExpenses,
        emergencyFundMonths,
        monthlySavings,
        totalEmergencyFund,
      });

      await userSavings.save();
      return res.status(201).json({
        statusCode: 201,
        message: 'Financial plan created successfully',
        data: {
          monthlyExpenses: userSavings.monthlyExpenses,
          emergencyFundMonths: userSavings.emergencyFundMonths,
          monthlySavings: userSavings.monthlySavings,
          totalEmergencyFund: userSavings.totalEmergencyFund,
        },
      });
    }

    // If found and updated, respond with the updated data
    res.status(200).json({
      statusCode: 200,
      message: 'Financial plan updated successfully',
      data: {
        monthlyExpenses: userSavings.monthlyExpenses,
        emergencyFundMonths: userSavings.emergencyFundMonths,
        monthlySavings: userSavings.monthlySavings,
        totalEmergencyFund: userSavings.totalEmergencyFund,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while updating the financial plan',
    });
  }
};
