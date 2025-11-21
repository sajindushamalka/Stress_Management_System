// import SavingPlan  from "../model/SavingPlan.js";

// // Add a new saving plan
// export const AddNewSavingPlan = async (req, res) => {
//   try {
//     const { startDate, endDate, targetAmount, email } = req.body;

//     if (!startDate || !endDate || !targetAmount || !email) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newPlan = new SavingPlan({
//         startDate,
//         endDate,
//         targetAmount,
//         email,
//     });

//     const savedPlan = await newPlan.save();

//     res.status(201).json({
//       message: "Saving Plan Added Successfully..!",
//       payload: savedPlan,
//     });
//   } catch (error) {
//     console.error("AddNewSavingPlan Error:", error);
//     res.status(500).json({
//       message: "Something went wrong while adding saving plan.",
//       error,
//     });
//   }
// };

// // Get all saving plans by email
// export const GetAllSavingPlansByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     const plans = await SavingPlan.find({ email });

//     if (plans.length === 0) {
//       return res.status(404).json({
//         message: "No Saving Plans found for this email.",
//       });
//     }

//     res.status(200).json(plans);
//   } catch (error) {
//     console.error("GetAllSavingPlansByEmail Error:", error);
//     res.status(500).json({
//       message: "Something went wrong while fetching saving plans.",
//       error,
//     });
//   }
// };

import SavingPlan from "../model/SavingPlan.js";
import axios from "axios";

// Your Flask URL
const FLASK_URL = "http://192.168.8.74:5001/predict";
 
// Add a new saving plan
export const AddNewSavingPlan = async (req, res) => {
  try {
    const { startDate, endDate, targetAmount, email } = req.body;

    if (!startDate || !endDate || !targetAmount || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ===============================
    // 🔥 CALL FLASK ML MODEL HERE
    // ===============================
    let mlResult = null;
    try {
      const flaskResponse = await axios.post(FLASK_URL, {
        start_date: startDate,
        end_date: endDate,
        target_amount: targetAmount,
        email: email,
      });

      mlResult = flaskResponse.data;

      console.log("🔥 ML Response From Flask:", mlResult);

    } catch (err) {
      console.log("❌ Flask ML Error:", err.message);
    }

    // ===========================================
    // SAVE IN MONGO WITH ML RESULTS INCLUDED
    // ===========================================
    const newPlan = new SavingPlan({
      startDate,
      endDate,
      targetAmount,
      email,

      // ML output saved to DB
      mlForecast: mlResult?.forecast || null,
      allowedSpending: mlResult?.allowed_spending || null,
    });

    const savedPlan = await newPlan.save();

    res.status(201).json({
      message: "Saving Plan Added Successfully!",
      payload: savedPlan,
      mlData: mlResult,   // <-- Sent to React
    });

  } catch (error) {
    console.error("AddNewSavingPlan Error:", error);
    res.status(500).json({
      message: "Something went wrong while adding the saving plan.",
      error,
    });
  }
};



// Get all saving plans by email
export const GetAllSavingPlansByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const plans = await SavingPlan.find({ email });

    res.status(200).json(plans);
  } catch (error) {
    console.error("GetAllSavingPlansByEmail Error:", error);
    res.status(500).json({
      message: "Something went wrong while fetching saving plans.",
      error,
    });
  }
};

