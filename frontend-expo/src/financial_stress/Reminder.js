import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Node from "../api/node/Node";
import { AuthContext } from "../context/AuthContext";

const Reminder = () => {
  const { userDetails } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [frequency, setFrequency] = useState("once");
  const [status, setStatus] = useState("pending");

  const [reminders, setReminders] = useState([]);

  // Fetch reminders
  const getReminders = () => {
    Node.get(`/reminder/user/${userDetails.RegisterdUser.email}`)
      .then((res) => setReminders(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getReminders();
  }, []);

  // Add reminder
  const addReminder = () => {
    if (!title) {
      Alert.alert("Required", "Please enter a title");
      return;
    }

    Node.post("/reminder/add", {
      title,
      description,
      dueDate,
      frequency,
      status,
      email: userDetails.RegisterdUser.email,
    })
      .then(() => {
        setTitle("");
        setDescription("");
        setDueDate(new Date());
        getReminders();
      })
      .catch(() => Alert.alert("Error", "Could not add reminder"));
  };

  // Delete reminder
  const removeReminder = (id) => {
    Node.delete(`/reminder/delete/${id}`)
      .then(() => getReminders())
      .catch(() => Alert.alert("Error", "Could not delete reminder"));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Finance Reminders</Text>

      {/* Input Card */}
      <View style={styles.inputCard}>
        <TextInput
          placeholder="Reminder Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Description"
          style={[styles.input, { height: 70 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Date Picker */}
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>
            Due Date: {dueDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}

        {/* Frequency Dropdown */}
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => setFrequency("once")}>
            <Text style={frequency === "once" ? styles.active : styles.item}>
              Once
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFrequency("daily")}>
            <Text style={frequency === "daily" ? styles.active : styles.item}>
              Daily
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFrequency("weekly")}>
            <Text style={frequency === "weekly" ? styles.active : styles.item}>
              Weekly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFrequency("monthly")}>
            <Text style={frequency === "monthly" ? styles.active : styles.item}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Dropdown */}
        <Text style={styles.label}>Status</Text>
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => setStatus("pending")}>
            <Text style={status === "pending" ? styles.active : styles.item}>
              Pending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStatus("completed")}>
            <Text style={status === "completed" ? styles.active : styles.item}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addReminder}>
          <Text style={styles.addBtnText}>Add Reminder</Text>
        </TouchableOpacity>
      </View>

      {/* Reminder List */}
      <FlatList
        data={reminders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.reminderCard}>
            <View>
              <Text style={styles.reminderTitle}>{item.title}</Text>
              <Text style={styles.reminderDate}>
                Due: {item.dueDate.split("T")[0]}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeReminder(item._id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Reminder;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF8C00",
    textAlign: "center",
  },
  inputCard: {
    backgroundColor: "#ffe4c2",
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#FF8C00",
  },
  dateBtn: {
    padding: 12,
    backgroundColor: "#FF8C00",
    borderRadius: 10,
    marginTop: 10,
  },
  dateText: { color: "white", fontWeight: "600" },
  label: { fontSize: 16, marginTop: 10, fontWeight: "600" },
  dropdown: { flexDirection: "row", gap: 10, marginVertical: 8 },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#444",
  },
  active: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#FF8C00",
    color: "white",
    borderRadius: 6,
  },
  addBtn: {
    backgroundColor: "#FF8C00",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  addBtnText: { color: "white", textAlign: "center", fontWeight: "bold" },
  reminderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fdd8a8",
    borderRadius: 10,
    marginVertical: 8,
  },
  reminderTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  reminderDate: { fontSize: 14, color: "#555" },
  deleteBtn: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteText: { color: "white", fontWeight: "bold" },
});
