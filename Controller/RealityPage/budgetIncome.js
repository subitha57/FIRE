const express = require('express');
const mongoose = require('mongoose');
const Income = require('../income');
const User = require('../../Model/emailModel');

const router = express.Router();

// Route to add income
router.post('/addIncome', async (req, res) => {
  const { userId, month, year, date, income, otherIncome = [] } = req.body;

  // Basic validation
  if (!userId || !month || !year || !date || !income || !Array.isArray(otherIncome)) {
    return res.status(400).json({
      success: false,
      message: "All fields are required, and otherIncome should be an array.",
    });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingIncome = await Income.findOne({ userId, month, year });
    if (existingIncome) {
      return res.status(400).json({
        success: false,
        message: "Income for this month and year already exists.",
      });
    }

    const validOtherIncome = otherIncome.map((item) => parseFloat(item) || 0);
    const totalOtherIncome = validOtherIncome.reduce((acc, value) => acc + value, 0);
    const totalIncomeValue = parseFloat(income.replace(/,/g, "")) + totalOtherIncome;

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

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income: newIncome,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Route to get income by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const income = await Income.findById(id);
    if (!income) {
      return res.status(404).json({ success: false, message: "Income not found" });
    }

    res.status(200).json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Route to update income
router.put('/updateIncome/:id', async (req, res) => {
  const { id } = req.params;
  const { month, year, date, income, otherIncome, userId } = req.body;

  if (!month || !year || !date || !income || !Array.isArray(otherIncome)) {
    return res.status(400).json({
      success: false,
      message: "All fields are required, and otherIncome should be an array.",
    });
  }

  try {
    const validOtherIncome = otherIncome.map((item) => parseFloat(item) || 0);
    const totalOtherIncome = validOtherIncome.reduce((acc, value) => acc + value, 0);
    const totalIncomeValue = parseFloat(income.replace(/,/g, "")) + totalOtherIncome;

    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { month, year, date, income, userId, otherIncome: validOtherIncome, totalIncome: totalIncomeValue.toString() },
      { new: true, runValidators: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ success: false, message: "Income not found" });
    }

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updatedIncome,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Route to delete income
router.delete('/deleteIncome/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIncome = await Income.findByIdAndDelete(id);
    if (!deletedIncome) {
      return res.status(404).json({ success: false, message: "Income not found" });
    }

    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Route to view income by user, month, and year
router.get('/viewIncome', async (req, res) => {
  const { userId, month, year } = req.query;

  try {
    const incomes = await Income.find({ userId, month, year });
    if (incomes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No income found for this user in the specified month and year",
      });
    }

    res.status(200).json({ success: true, data: incomes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
