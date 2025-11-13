import mongoose from "mongoose"

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true
    // }
});

export default mongoose.model("incomes", incomeSchema);