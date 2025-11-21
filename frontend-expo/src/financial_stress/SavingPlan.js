import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Node from "../api/node/Node";
import Fast from "../api/fast/Fast";

const SavingPlan = () => {
  const { userDetails } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [targetAmount, setTargetAmount] = useState("");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  const [events, setEvents] = useState({});

  // ============================
  // SAVE SAVING PLAN
  // ============================
  const handleSave = async () => {
    if (!targetAmount) {
      Alert.alert("Error", "Enter a target saving amount");
      return;
    }

    const savingPlanPayload = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      targetAmount: Number(targetAmount),
      email: userDetails.RegisterdUser.email,
    };

    try {
      // 1️⃣ Save to Node backend
      const res = await Node.post("/saving/add", savingPlanPayload);

      if (res.status === 201) {
        // 2️⃣ Call ML Flask API
        const payload = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          targetAmount: Number(targetAmount),
        };

        Fast.post("/predict", payload)
          .then((res) => console.log("ML RESPONSE:", res.data))
          .catch((err) => console.log("❌ ML Error:", err.response.data));

        const mlData = await mlResponse.json();
        console.log("ML RESPONSE:", mlData);

        Alert.alert("Success", "Saving Plan Added Successfully!");

        setModalVisible(false);
        setStartDate(new Date());
        setEndDate(new Date());
        setTargetAmount("");

        fetchSavingPlans();
      } else {
        Alert.alert("Error", "Something went wrong!");
      }
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to save saving plan!");
    }
  };

  // ============================
  // FETCH SAVING PLANS
  // ============================
  const fetchSavingPlans = async () => {
    try {
      const res = await Node.get(
        `/saving/all/${userDetails.RegisterdUser.email}`
      );

      const formattedEvents = {};

      res.data.forEach((item) => {
        const start = new Date(item.startDate).toLocaleDateString();
        const end = new Date(item.endDate).toLocaleDateString();

        if (!formattedEvents[start]) formattedEvents[start] = [];

        formattedEvents[start].push({
          _id: item._id,
          startDate: start,
          endDate: end,
          targetAmount: item.targetAmount,

          // ML outputs saved in DB by Node
          mlForecast: item.mlForecast || null,
          allowedSpending: item.allowedSpending || null,
        });
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSavingPlans();
  }, []);

  // ============================
  // FILTERING
  // ============================
  const getFilteredEvents = () => {
    if (activeTab === "Today") {
      const today = new Date().toLocaleDateString();
      return events[today] ? { [today]: events[today] } : {};
    }
    return events;
  };

  const filteredEvents = getFilteredEvents();

  const flatData = [];
  Object.keys(filteredEvents).forEach((date) => {
    filteredEvents[date].forEach((item) => {
      flatData.push({ ...item, date });
    });
  });

  return (
    <LinearGradient colors={["#fff", "#f3ddc3"]} style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Saving Plan</Text>
        <Text style={styles.subHeading}>Create a plan to save smartly.</Text>

        {/* Add Button */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingTop: 10,
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome name="plus" size={18} color="#FF8C00" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("All")}
            style={[styles.tab, activeTab === "All" && styles.activeTab]}
          >
            <Text>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("Today")}
            style={[styles.tab, activeTab === "Today" && styles.activeTab]}
          >
            <Text>Today</Text>
          </TouchableOpacity>
        </View>

        {/* LIST */}
        <View style={{ maxHeight: 250, margin: 10 }}>
          <ScrollView>
            {flatData.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#555" }}>
                No saving plans yet.
              </Text>
            ) : (
              flatData.map((item, index) => (
                <View key={index} style={styles.planBox}>
                  <Text style={{ fontWeight: "bold" }}>
                    📅 {item.startDate} → {item.endDate}
                  </Text>
                  <Text>🎯 Target: Rs. {item.targetAmount}</Text>

                  {/* Allowed spending */}
                  {item.allowedSpending !== null && (
                    <Text style={styles.mlText}>
                      💰 Allowed Spending: Rs.{" "}
                      {Number(item.allowedSpending).toFixed(2)}
                    </Text>
                  )}

                  {/* Forecast Total */}
                  {item.mlForecast?.total !== undefined && (
                    <Text style={styles.mlText}>
                      🔮 Forecasted Expense: Rs.{" "}
                      {Number(item.mlForecast.total).toFixed(2)}
                    </Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Set Your Saving Plan</Text>

            {/* Start */}
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowStartPicker(true)}
            >
              <Text>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, date) => {
                  setShowStartPicker(false);
                  if (date) setStartDate(date);
                }}
              />
            )}

            {/* End */}
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowEndPicker(true)}
            >
              <Text>{endDate.toDateString()}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, date) => {
                  setShowEndPicker(false);
                  if (date) setEndDate(date);
                }}
              />
            )}

            {/* Target */}
            <Text style={styles.label}>Target Saving Amount (Rs.)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter amount"
              value={targetAmount}
              onChangeText={setTargetAmount}
            />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#FF8C00" }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#aaa" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Footer />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  heading: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF8C00",
    marginBottom: 10,
    paddingTop: 40,
  },
  subHeading: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 4,
  },
  tab: { padding: 10, marginHorizontal: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#FF8C00" },
  iconButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },
  planBox: {
    marginVertical: 6,
    padding: 12,
    backgroundColor: "#ffe8cc",
    borderRadius: 8,
  },
  mlText: { marginTop: 4, color: "#333" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: "#FF8C00",
  },
  label: { marginBottom: 5, fontWeight: "600", color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  button: { padding: 10, borderRadius: 8, width: "48%", alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default SavingPlan;
