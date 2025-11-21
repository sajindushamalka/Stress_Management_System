import mongoose from "mongoose";

const SavingPlanSchema = new mongoose.Schema(
  {
    
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    targetAmount: { 
        type: Number, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

export default mongoose.model("SavingPlan", SavingPlanSchema);

