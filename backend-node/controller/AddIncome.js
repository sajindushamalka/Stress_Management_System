import AddIncome from "../model/AddIncome.js";
import TransactionType from "../enum/TransactionType.js";

export const AddNewTransaction = async (req, res) => {
  try {
    // extract required fields
    const { type, email, amount, date, category, note } = req.body;

    if (!Object.values(TransactionType).includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }
    // save new transaction
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
      balance : {
        total : totalIncome - totalExpense,
      }
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
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({
      message: "Income deleted successfully",
      payload: deleted,
    });
  } catch (error) {
    console.error("DeleteIncome Error:", error);
    res.status(500).json({
      message: "Something went wrong while deleting income",
      error: error.message,
    });
  }
};
