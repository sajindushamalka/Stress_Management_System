import Reminders from "../model/Reminder.js";

/**
 * ADD NEW REMINDER
 */
export const addReminder = async (req, res) => {
  try {
    const { title, description, dueDate, frequency, status, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "User email is required!" });
    }

    const reminder = await Reminders.create({
      title,
      description,
      dueDate,
      frequency,
      status,
      email,
    });

    res.status(200).json({
      message: "Reminder created successfully",
      data: reminder,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding reminder", error: error.message });
  }
};


/**
 * GET REMINDERS OF LOGGED USER
 */
export const getUserReminders = async (req, res) => {
  try {
    const userEmail = req.params.email;

    if (!userEmail) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const reminders = await Reminders.find({ email: userEmail }).sort({ dueDate: 1 });

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching reminders", 
      error: error.message 
    });
  }
};


/**
 * DELETE REMINDER
 */
export const deleteReminder = async (req, res) => {
  try {
    const reminderId = req.params.id;

    const deleted = await Reminders.findByIdAndDelete(reminderId);

    if (!deleted) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({
      message: "Reminder deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting reminder", 
      error: error.message 
    });
  }
};
