import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const SavingPlan = () => {
  const { userDetails } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <LinearGradient
      colors={["#ffffffff", "#f3ddc3ff"]}
      style={styles.container}
    >
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Saving Plan</Text>
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
      </ScrollView>
      {/* Modal Popup Form */}
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
              Set Your Saving Plan
            </Text>

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
               // selectedValue={type}
                onValueChange={(v) => setType(v)}
                style={{ height: 50, width: "100%" }}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Income" value="income" />
                <Picker.Item label="Expenses" value="expense" />
              </Picker>
            </View>
            {/* Income Categories */}
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
                 // selectedValue={category}
                  onValueChange={(v) => setCategory(v)}
                  style={{ height: 50, width: "100%" }}
                >
                  <Picker.Item label="Select Category" value="" />
                  <Picker.Item label="Pocket Money" value="Pocket_Money" />
                  <Picker.Item label="Salary" value="Salary" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Rs."
            //   value={amount}
            //   onChangeText={setAmount}
            />
            <TextInput
              style={styles.input}
            //   value={note}
            //   onChangeText={setNote}
              multiline
              placeholder="Enter your note here..."
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
               // onPress={validateAndSave}
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
  container: { flex: 1, paddingTop: 30 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  heading: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF8C00",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    paddingTop: 40,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
   iconButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        width: 60,
        elevation: 3, // adds shadow on Android
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 1, height: 2 },
        shadowRadius: 4,
    },
});

export default SavingPlan;
