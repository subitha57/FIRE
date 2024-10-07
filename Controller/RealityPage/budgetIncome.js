const RealityIncome = require('../../Model/Reality/budgetIncomeModel');
const User = require('../../Model/emailModel');

exports.createRealityIncome = async (req, res) => {
    //#swagger.tags = ['Reality-IncomeSource']
    try {
        const { month, year, income, otherIncome = [], userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otherIncomeValues = otherIncome.map(item => ({
            source: item.source || '', // Provide source of income (e.g., rent, interest)
            amount: Number(item.amount) || 0
        }));

        const totalOtherIncome = otherIncomeValues.reduce((sum, item) => sum + item.amount, 0);
        const totalIncome = Number(income) + totalOtherIncome;

        const newRealityIncome = new RealityIncome({
            month,
            year,
            income: Number(income),
            otherIncome: otherIncomeValues,
            totalIncome,
            userId,
        });

        await newRealityIncome.save();
        res.status(201).json({ message: "Reality income added successfully", income: newRealityIncome });
    } catch (error) {
        res.status(500).json({ message: "Error adding reality income", error: error.message });
    }
};

exports.Update = async (req, res) => {
    //#swagger.tags = ['Reality-IncomeSource']
    try {
        const { id } = req.params;
        const {
            month,
            year,
            income,
            otherIncome = [],
            userId,
            propagate,
        } = req.body;

        const realityIncome = await RealityIncome.findById(id);
        if (!realityIncome) {
            return res.status(404).json({ message: "Reality income not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otherIncomeValues = otherIncome.map(item => ({
            source: item.source || '',
            amount: Number(item.amount) || 0
        }));

        const totalOtherIncome = otherIncomeValues.reduce((sum, item) => sum + item.amount, 0);
        const totalIncome = Number(income) + totalOtherIncome;

        const updatedRealityIncome = await RealityIncome.findByIdAndUpdate(
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

        // If propagate is true, update future reality incomes
        if (propagate) {
            const monthsOfYear = [
                "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"
            ];

            const startMonthIndex = monthsOfYear.indexOf(month);

            for (let i = startMonthIndex + 1; i < monthsOfYear.length; i++) {
                const futureMonth = monthsOfYear[i];

                const futureRealityIncome = await RealityIncome.findOne({
                    month: futureMonth,
                    year,
                    userId,
                });

                if (futureRealityIncome) {
                    await RealityIncome.findByIdAndUpdate(futureRealityIncome._id, {
                        income: Number(income),
                        otherIncome: futureRealityIncome.otherIncome,
                        totalIncome: Number(income) + totalOtherIncome,
                    });
                }
            }
        }

        return res.status(201).json({
            message: "Reality income updated successfully",
            realityIncome: updatedRealityIncome,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update reality income",
            error: error.message,
        });
    }
};

exports.getById = async (req, res) => {
    //#swagger.tags = ['Reality-IncomeSource']
    try {
        const { id } = req.params;

        const realityIncome = await RealityIncome.findById(id);
        if (!realityIncome) {
            return res.status(404).json({ message: "Reality income not found" });
        }

        return res.status(200).json({
            message: "Reality income retrieved successfully",
            realityIncome,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve reality income",
            error: error.message,
        });
    }
};

exports.View = async (req, res) => {
    //#swagger.tags = ['Reality-IncomeSource']
    try {
        const { month, year, userId } = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const realityIncome = await RealityIncome.findOne({ month, year, userId });
        if (!realityIncome) {
            return res.status(200).json({ message: "No reality income found for the selected month and year" });
        }

        return res.status(200).json({
            message: "Reality income retrieved successfully",
            realityIncome: {
                id: realityIncome._id,
                income: realityIncome.income,
                otherIncome: realityIncome.otherIncome,
                totalIncome: realityIncome.totalIncome,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve reality income",
            error: error.message,
        });
    }
};

exports.Delete = async (req, res) => {
    //#swagger.tags = ['Reality-IncomeSource']
    try {
        const { id } = req.params;

        const realityIncome = await RealityIncome.findById(id);
        if (!realityIncome) {
            return res.status(404).json({ message: "Reality income not found" });
        }

        await RealityIncome.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Reality income deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete reality income",
            error: error.message,
        });
    }
};

exports.CalculateBudget = async (req, res) => {
    //#swagger.tags = ['Reality-IncomeSource']
    try {
        const { month, year, userId } = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const realityIncome = await RealityIncome.findOne({ month, year, userId });
        if (!realityIncome) {
            return res.status(404).json({ message: "No reality income found for the selected month and year" });
        }

        const expensesAllocation = await ExpensesAllocation.findOne({
            month,
            year,
            userId,
        });
        if (!expensesAllocation) {
            return res.status(404).json({ message: "No personal budget found for the selected month and year" });
        }

        const totalIncome = realityIncome.totalIncome;
        const totalExpenses = expensesAllocation.totalExpenses;

        const remainingBalance = totalIncome - totalExpenses;

        return res.status(200).json({
            message: "Budget calculated successfully",
            income: realityIncome.income,
            otherIncome: realityIncome.otherIncome,
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
