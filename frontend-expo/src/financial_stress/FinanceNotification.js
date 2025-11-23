import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Node from "../api/node/Node";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { AuthContext } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

const FinanceNotification = () => {
  const { userDetails } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  const fetchAIAnalysis = () => {
    setLoading(true);
    Node.get(`/transaction/analyze/${userDetails.RegisterdUser.email}`)
      .then((res) => setAiData(res.data))
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "Failed to fetch AI recommendations");
      })
      .finally(() => setLoading(false));
  };

  const getDynamicRedColor = (level) => {
    if (level < 20) return "#ffcccc";
    if (level < 50) return "#ff9999";
    if (level < 70) return "#ff6666";
    if (level < 90) return "#ff3b30";
    if (level <= 100) return "#cc0000";
    return "#990000";
  };

  return (
    <LinearGradient colors={["#ffffff", "#fdfaf6"]} style={styles.root}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}> AI Financial Insights</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#ff9800" />
        ) : aiData ? (
          <>
            {/* Stress Level */}
            {aiData.stressLevel && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="warning" size={22} color="#ff9800" />
                  <Text style={styles.cardTitle}>Stress Level</Text>
                </View>
                <Progress.Bar
                  progress={aiData.stressLevel / 100}
                  width={null}
                  height={14}
                  borderRadius={7}
                  color={getDynamicRedColor(aiData.stressLevel)}
                  borderWidth={0}
                  unfilledColor="#e0e0e0"
                />
                <Text style={styles.progressLabel}>
                  {aiData.stressLevel}% - {aiData.stressLevelLevel || ""}
                </Text>
              </View>
            )}

            {/* Alerts */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="notifications" size={22} color="#ff9800" />
                <Text style={styles.cardTitle}>Alerts</Text>
              </View>
              {aiData.alerts?.length > 0 ? (
                aiData.alerts.map((alert, index) => (
                  <View key={index} style={styles.alertCard}>
                    <Entypo name="dot-single" size={20} color="#ff9800" />
                    <Text style={styles.alertText}>
                      {typeof alert === "string"
                        ? alert
                        : JSON.stringify(alert)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noData}>No alerts detected.</Text>
              )}
            </View>

            {/* Recommendations */}
            <Text style={[styles.subTitle, { marginTop: 20 }]}>
              <MaterialIcons name="thumb-up" size={20} color="#ff9800" />{" "}
              Recommendations
            </Text>
            {aiData.recommendations?.length > 0 ? (
              aiData.recommendations.map((rec, index) => (
                <View key={index} style={styles.card}>
                  <View style={styles.recommendationRow}>
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#ff9800"
                    />
                    <Text style={styles.recommendationText}>
                      {typeof rec === "string"
                        ? rec
                        : `Category: ${rec.category || "N/A"} - Amount: ${
                            rec.amount ? "Rs " + rec.amount : "N/A"
                          }`}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noData}>No recommendations available.</Text>
            )}

            {/* High Spending Categories */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>High Spending Categories</Text>
              </View>
              <View style={styles.categoriesContainer}>
                {aiData.highSpendingCategories?.length > 0 ? (
                  aiData.highSpendingCategories.map((cat, idx) => (
                    <LinearGradient
                      key={idx}
                      colors={["#ffe0b2", "#ffcc80"]}
                      style={styles.categoryBox}
                    >
                      <Text style={styles.categoryText}>{cat}</Text>
                    </LinearGradient>
                  ))
                ) : (
                  <Text style={styles.noData}>
                    No high spending categories found.
                  </Text>
                )}
              </View>
            </View>

            {/* Feedback */}
            {aiData.feedback && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="feedback" size={22} color="#ff9800" />
                  <Text style={styles.cardTitle}>Financial Feedback</Text>
                </View>
                <Text style={styles.feedbackText}>{aiData.feedback}</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noData}>No AI data available.</Text>
        )}
      </ScrollView>
      <Footer />
    </LinearGradient>
  );
};

export default FinanceNotification;

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, paddingBottom: 120 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ff9800",
    textAlign: "center",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff9800",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginLeft: 8 },
  progressLabel: {
    textAlign: "right",
    fontSize: 14,
    marginTop: 6,
    color: "#555",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  alertText: { color: "#ff9800", fontSize: 14, marginLeft: 6 },
  recommendationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    marginLeft: 6,
  },
  categoriesContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  categoryBox: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: { color: "#bf360c", fontSize: 14, fontWeight: "600" },
  feedbackText: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    lineHeight: 20,
  },
  noData: { color: "#888", fontSize: 14, fontStyle: "italic", marginTop: 4 },
});
