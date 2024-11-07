
const express = require('express');
const mongoose = require('mongoose');
const Income = require('../Model/incomeModel')
const User = require('../Model/emailModel'); 

exports.create = async (req, res) => {
  const { income, otherIncome = [], month, year, date = new Date() } = req.body;
  const userId = req.user.userId;
  try {
    // Ensure otherIncome is an array and contains only numbers
    if (!Array.isArray(otherIncome) || !otherIncome.every(item => typeof item === 'number')) {
      return res.status(400).json({ error: 'otherIncome must be an array of numbers' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingIncome = await Income.findOne({ userId, month, year });
    if (existingIncome) {
      return res.status(400).json({ error: 'Income for this month already exists' });
    }

    const totalOtherIncome = otherIncome.reduce((acc, curr) => acc + curr, 0);
    const totalIncome = income + totalOtherIncome;

    const newIncome = new Income({
      userId,
      month,
      year,
      income,
      otherIncome,
      totalIncome,
      date
    });

    // Save the income record to the database
    await newIncome.save();

    res.status(201).json({ message: 'Income added successfully', income: newIncome });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
//id
exports.getById = async (req, res) => {
  const userId = req.user.userId;
    try {
      console.log("ID received:", req.params.id); 
      const income = await Income.findById(req.params.id,userId );
      if (!income) {
        return res.status(404).json({ error: 'Income not found' });
      }
      res.status(200).json(income);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  exports.put = async (req, res) => {
    const { income, otherIncome = [], month, year } = req.body;
    const userId = req.user.userId;

    if (income === undefined || month === undefined || year === undefined) {
      return res.status(400).json({ error: 'Required fields (income, month, year) are missing' });
    }
  
    // Ensure income is a number
    if (isNaN(income)) {
      return res.status(400).json({ error: 'Income must be a valid number' });
    }
  
    try {
      const incomeRecord = await Income.findById(req.params.id,userId);
      if (!incomeRecord) {
        return res.status(404).json({ error: 'Income record not found' });
      }
        // Update the income data
      incomeRecord.income = income;
      incomeRecord.otherIncome = otherIncome;
      incomeRecord.month = month;
      incomeRecord.year = year;
      incomeRecord.totalIncome = income + otherIncome.reduce((acc, curr) => acc + curr, 0);
  
      await incomeRecord.save();
      res.status(200).json({ message: 'Income updated successfully', income: incomeRecord });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  