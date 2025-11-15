import AddIncome from '../model/AddIncome.js'

export const AddNewIncome = async (req, res) => {
   console.log(req.body)
 try{      
      const newVol = new AddIncome({
        date: req.body.date,
        category: req.body.category,
        amount: req.body.amount,
        note: req.body.note,
        //email: req.body.email
      });

      const newV = await newVol.save();
      console.log(newVol);
      if (newV) {
      
        res.status(201).json({
          message: "Income Added Successfully..!",
          payload: newV
        })
      } else {

        res.status(400).json({
          message: "Something Went Wrong in Income Adding..!"
        })
      } 
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong..!",
      error: error
    })
  }
}

// Get all incomes
export const GetAllIncome = async (req, res) => {
  try {
    const incomes = await AddIncome.find(); // Fetch all incomes
    res.status(200).json({
      message: "Fetched all incomes successfully",
      payload: incomes, // <-- must be an array!
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching incomes",
      error: error.message,
    });
  }
};

// Delete an income record by ID
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