import express from "express";
import {
  addReminder,
  getUserReminders,
  deleteReminder,
} from "../controller/Reminder.js";

const router = express.Router();

router.post("/add", addReminder);
router.get("/user/:email", getUserReminders);
router.delete("/delete/:id", deleteReminder);

export default router;
