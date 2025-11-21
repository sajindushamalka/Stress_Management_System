import SocialStress from '../model/SocialStress.js'
import moment from "moment";


export const AddSocialStress = async (req, res) => {

    try {
        const email = req.body.user_email;
        const dateOnly = new Date(req.body.date);
        const startOfDay = new Date(dateOnly.setHours(0, 0, 0, 0));
        const endOfDay = new Date(dateOnly.setHours(23, 59, 59, 999));


        // 1️⃣ Delete existing timetables for this email
        await SocialStress.deleteMany({ user_email: email, date: { $gte: startOfDay, $lte: endOfDay } });

        // 2️⃣ Create new timetable
        const newVol = new SocialStress({
            user_email: req.body.user_email,
            calls_incoming: req.body.calls_incoming,
            face_mood: req.body.face_mood,
            messages_received: req.body.messages_received,
            messages_sent: req.body.messages_sent,
            sleep_hours: req.body.sleep_hours,
            predicted_label: req.body.predicted_label,
            date: req.body.date,
            probabilities: req.body.probabilities
        });

        const newV = await newVol.save();

        if (newV) {
            res.status(201).json({
                message: "New Lecture Created Successfully!",
                payload: newV
            });
        } else {
            res.status(400).json({
                message: "Something Went Wrong While Creating!"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Something Went Wrong!",
            error: error.message
        });
    }
};

export const GetMyLastValues = async (req, res) => {
    try {
        const { user_email } = req.params;

        const data = await SocialStress.find({
            user_email,
        }).sort({ date: -1 });

        res.status(200).json({
            data
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            message: "Something went wrong while fetching data.",
            error: error.message,
        });
    }
};
