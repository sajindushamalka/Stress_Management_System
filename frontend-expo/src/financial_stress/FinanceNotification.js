import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Node from "../api/node/Node";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { AuthContext } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

const FinanceNotification = () => {
  const { userDetails } = useContext(AuthContext);

 

  const deleteCard = (category) => {
    Alert.alert(
      "Remove Notification",
      `Are you sure you want to remove ${category} alert?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const newData = { ...weeklyData };
            delete newData[category];
            setWeeklyData(newData);
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#ffffff", "#f3ddc3"]} style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
      </ScrollView>

      <Footer />
    </LinearGradient>
  );
};

export default FinanceNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },

  

  deleteBtn: {
    padding: 6,
  },
});
