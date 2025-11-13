import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Node from "../api/node/Node";
import { Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { FontAwesome6, Ionicons, Foundation } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

const FinancialDashboard = () => {
  const { userDetails } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // Handle Income Add Icon Press
  const handleAddForm = () => {
    setModalVisible(true);
  };

  // Add Income
  const handleAddIncome = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const incomeData = {
      date: formattedDate,
      category: category,
      amount: amount,
      note: note,
    };

    try {
      const res = await Node.post("/income/add", incomeData);
     console.log("Backend response:");
 
      if (res.status === 201) {
        Alert.alert("Success", "Income Added Successfully!");
        setModalVisible(false);
        setCategory("");
        setAmount("");
        setNote("");
      } else {
        Alert.alert("Error", "Backend did not confirm save.");
      }
    } catch (error) {
      console.error("Add Income Error:", error.message);
      Alert.alert("Error", "Failed to add income. Check console for details.");
    }
  };

  return (
    <LinearGradient
      colors={["#ffffffff", "#f3ddc3ff"]}
      style={styles.container}
    >
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Financial Stress</Text>

        {/* Bottom buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.iconButton} onPress={handleAddForm}>
            <Ionicons name="add-circle" size={28} color="#FF8C00" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome6 name="money-check-dollar" size={28} color="#FF8C00" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Foundation name="alert" size={28} color="#FF8C00" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Income Adding */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Add Income
            </Text>

            {/* Category Picker */}
            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                marginBottom: 15,
                overflow: "hidden",
              }}
            >
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={{ height: 50, width: "100%" }}
              >
                <Picker.Item label="Select Category" value="" />
                <Picker.Item label="Pocket Money" value="Pocket_Money" />
                <Picker.Item label="Salary" value="Salary" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Amount Field */}
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 15,
              }}
            >
              <TextInput
                keyboardType="numeric"
                placeholder="Rs."
                value={amount}
                onChangeText={setAmount}
              />
            </TouchableOpacity>

            {/* Note Field */}
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 15,
              }}
            >
              <TextInput
                value={note}
                onChangeText={setNote}
                multiline={true}
                placeholder="Enter your note here..."
              />
            </TouchableOpacity>

            {/* Modal buttons */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={handleAddIncome}
                style={{
                  backgroundColor: "#FF8C00",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: "#aaa",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white" }}>Cancel</Text>
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
  container: {
    flex: 1,
    paddingTop: 30,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  heading: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF8C00",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    paddingTop: 40,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 10,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    width: 100,
    elevation: 3, // adds shadow on Android
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
  },
  buttonLabel: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    height: 40,
    margin: 1,
    marginVertical: 6,
    borderWidth: 1,
    padding: 10,
  },
});

export default FinancialDashboard;
