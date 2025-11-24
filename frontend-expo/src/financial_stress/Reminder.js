import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import Node from "../api/node/Node"; // Your API helper
import { AuthContext } from "../context/AuthContext";
import Footer from "../pages/Footer";

const frequencies = ["once", "daily", "weekly", "monthly"];

const Reminder = () => {
  const { userDetails } = useContext(AuthContext);
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [frequency, setFrequency] = useState("once");
  const [loading, setLoading] = useState(false);

  const fetchReminders = async () => {
    if (!userDetails) return;
    try {
      setLoading(true);
      const response = await Node.get(`/reminder/user/${userDetails.RegisterdUser.email}`);
      setReminders(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleAddReminder = async () => {
    if (!title || !dueDate) {
      Alert.alert("Validation", "Title and due date are required!");
      return;
    }

    try {
      const payload = { title, description, dueDate, frequency, email: userDetails.RegisterdUser.email };
      const response = await Node.post("/reminder/add", payload);
      Alert.alert("Success", response.data.message);
      setTitle("");
      setDescription("");
      setDueDate(new Date());
      setFrequency("once");
      fetchReminders(); // Refresh list
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteReminder = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this reminder?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await Node.delete(`/reminder/delete/${id}`);
            fetchReminders();
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const renderReminder = ({ item }) => (
    <View style={styles.reminderCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text style={styles.reminderDesc}>{item.description}</Text>
        <Text style={styles.reminderMeta}>
          Due: {new Date(item.dueDate).toLocaleString()} | Frequency: {item.frequency}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteReminder(item._id)} style={styles.deleteBtn}>
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#ffffff", "#f3ddc3"]} style={{ flex: 1 }}>
      {/* <ScrollView contentContainerStyle={styles.scrollContent}> */}
        <Text style={styles.heading}>Reminders</Text>

        {/* Add Reminder Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description"
            multiline
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateBtn}
          >
            <Text style={styles.dateBtnText}>
              {`Due Date: ${dueDate.toLocaleString()}`}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="datetime"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}

          <View style={styles.frequencyContainer}>
            {frequencies.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFrequency(f)}
                style={[
                  styles.freqBtn,
                  frequency === f && styles.freqBtnSelected,
                ]}
              >
                <Text
                  style={[
                    styles.freqBtnText,
                    frequency === f && styles.freqBtnTextSelected,
                  ]}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAddReminder}>
            <Text style={styles.addBtnText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>

        {/* Reminder List */}
        <Text style={styles.subHeading}>Your Reminders</Text>
        {loading ? (
          <Text style={{ textAlign: "center", marginVertical: 20 }}>Loading...</Text>
        ) : reminders.length === 0 ? (
          <Text style={{ textAlign: "center", marginVertical: 20 }}>No reminders found.</Text>
        ) : (
          <FlatList
            data={reminders.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))}
            renderItem={renderReminder}
            keyExtractor={(item) => item._id}
          />
        )}
      <Footer />
    </LinearGradient>
  );
};

export default Reminder;

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 100 },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4caf50",
    textAlign: "center",
    marginVertical: 20,
  },
  form: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  dateBtn: {
    padding: 12,
    backgroundColor: "#e0f2f1",
    borderRadius: 8,
    marginBottom: 10,
  },
  dateBtnText: { color: "#00796b" },
  frequencyContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  freqBtn: { padding: 8, borderRadius: 6, borderWidth: 1, borderColor: "#ccc" },
  freqBtnSelected: { backgroundColor: "#4caf50", borderColor: "#4caf50" },
  freqBtnText: { color: "#555", textAlign: "center" },
  freqBtnTextSelected: { color: "#fff" },
  addBtn: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  subHeading: { fontSize: 22, fontWeight: "600", marginVertical: 15, color: "#333" },
  reminderCard: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  reminderTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
  reminderDesc: { fontSize: 14, color: "#555", marginBottom: 5 },
  reminderMeta: { fontSize: 12, color: "#999" },
  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  deleteBtnText: { color: "#f44336", fontWeight: "bold" },
});
