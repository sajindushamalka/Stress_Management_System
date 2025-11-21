import AddIncome from "../model/AddIncome.js";
import TransactionType from "../enum/TransactionType.js";

export const AddNewTransaction = async (req, res) => {
  try {
    const { type, email, amount, date, category, note } = req.body;

    if (!Object.values(TransactionType).includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }
    const newVol = new AddIncome({
      date,
      type,
      category,
      amount,
      note,
      email,
    });

    const saved = await newVol.save();

    res.status(201).json({
      message: "Transaction Added Successfully..!",
      payload: saved,
    });
  } catch (error) {
    console.error("AddNewTransaction Error:", error);
    res.status(500).json({
      message: "Something Went Wrong..! ",
      error,
    });
  }
};

// Get all incomes, expenses and balance by mail
export const GetAllIncomeByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const income = await AddIncome.find({ email });

    if (income.length === 0) {
      return res.status(404).json({
        message: "No Transaction found for this email.",
      });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching lectures.",
      error,
    });
  }
};

export const MonthlySummaryCal = async (req, res) => {
  try {
    const { email } = req.params;

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const firstDayStr = firstDay.toISOString().split("T")[0];
    const lastDayStr = lastDay.toISOString().split("T")[0];

    const incomes = await AddIncome.find({
      email: email,
      type: "income",
      date: { $gte: firstDayStr, $lte: lastDayStr },
    });

    const expenses = await AddIncome.find({
      email: email,
      type: "expense",
      date: { $gte: firstDayStr, $lte: lastDayStr },
    });

    const totalIncome = incomes.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    const totalExpense = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    res.status(200).json({
      month: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}`,
      income: {
        total: totalIncome,
        count: incomes.length,
      },
      expense: {
        total: totalExpense,
        count: expenses.length,
      },
      balance: {
        total: totalIncome - totalExpense,
      },
    });
  } catch (error) {
    console.error("Monthly Summary Error:", error);
    res.status(500).json({
      message: "Failed to calculate monthly summary",
      error,
    });
  }
};

// Delete an transaction record by ID
export const DeleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await AddIncome.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    let revertAmount = Number(deleted.amount);
    let revertType = deleted.type;

    let adjustment = 0;

    if (revertType === "income") {
      adjustment = -revertAmount;
    } else if (revertType === "expense") {
      adjustment = +revertAmount;
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
      payload: deleted,
      revert: {
        type: revertType,
        amount: revertAmount,
        adjustment: adjustment,
      },
    });
  } catch (error) {
    console.error("DeleteIncome Error:", error);
    res.status(500).json({
      message: "Something went wrong while deleting income",
      error: error.message,
    });
  }
};

// Get Weekly Expenses Category-wise (Auto Week Calculation)
export const WeeklyExpenseCategory = async (req, res) => {
  try {
    const { email } = req.params;

    // Auto calculate last 7 days
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const startDate = lastWeek.toISOString().split("T")[0];
    const endDate = today.toISOString().split("T")[0];

    // Fetch expenses for the auto-calculated week
    const expenses = await AddIncome.find({
      email,
      type: "expense",
      date: { $gte: startDate, $lte: endDate },
    });

    // If no data
    if (expenses.length === 0) {
      return res.status(200).json({
        summary: {},
        message: "No expenses for this week.",
      });
    }

    // Group category-wise
    const summary = {};

    expenses.forEach((item) => {
      if (!summary[item.category]) {
        summary[item.category] = {
          totalAmount: 0,
          transactions: 0,
        };
      }

      summary[item.category].totalAmount += Number(item.amount);
      summary[item.category].transactions += 1;
    });

    // Return only summary without date range
    res.status(200).json(summary);

  } catch (error) {
    console.error("WeeklyExpenseCategory Error:", error);
    res.status(500).json({
      message: "Failed to fetch weekly expense summary",
      error: error.message,
    });
  }
};

