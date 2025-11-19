import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { LineChart } from 'react-native-chart-kit';
import Footer from "../pages/Footer";
import Node from "../api/node/Node";
import Header from "../pages/Header";
import { MaterialIcons } from "@expo/vector-icons";

const ExpensesSection = () => {
  const { userDetails } = useContext(AuthContext);

  const [events, setEvents] = useState({});
  const [activeTab, setActiveTab] = useState("All");

  // FETCH ALL USER TRANSACTIONS
  useEffect(() => {
    Node.get(`/transaction/all/${userDetails.RegisterdUser.email}`)
      .then((res) => {
        const formattedEvents = {};
        res.data.forEach((item) => {
          if (!formattedEvents[item.date]) formattedEvents[item.date] = [];
          formattedEvents[item.date].push({
            _id: item._id,
            type: item.type,
            note: item.note,
            category: item.category,
            amount: item.amount,
            date: item.date,
          });
        });
        setEvents(formattedEvents);
      })
      .catch((err) => console.log(err));
  }, []);

  // FILTERED LIST FOR ALL / TODAY
  const getFilteredEvents = () => {
    if (activeTab === "Today") {
      const today = new Date().toISOString().split("T")[0];
      return events[today] ? { [today]: events[today] } : {};
    }
    return events;
  };

  const filteredEvents = getFilteredEvents();

  // FLATTEN LIST FOR DISPLAY
  const flatData = [];
  Object.keys(filteredEvents).forEach((date) => {
    filteredEvents[date].forEach((item) => {
      if (item.type === "expense") {
        flatData.push(item);
      }
    });
  });
  return (
    <LinearGradient
      colors={["#ffffffff", "#f3ddc3ff"]}
      style={styles.container}
    >
      <Header />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Expenses Summary</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("All")}
            style={[styles.tab, activeTab === "All" && styles.activeTab]}
          >
            <Text style={styles.tabText}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("Today")}
            style={[styles.tab, activeTab === "Today" && styles.activeTab]}
          >
            <Text style={styles.tabText}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* DATA LIST */}
        <View style={{ maxHeight: 300, margin: 10 }}>
          <ScrollView>
            {flatData.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#555" }}>
                No data added yet.
              </Text>
            ) : (
              flatData
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.card,
                      {
                        borderLeftColor:
                          item.type === "income" ? "#4CAF50" : "#f44336",
                      },
                    ]}
                  >
                    {activeTab === "All" && (
                      <Text style={styles.cardHeader}>
                        📅 {item.date} • {item.type.toUpperCase()}
                      </Text>
                    )}

                    <View style={styles.row}>
                      <Text style={styles.cardText}>
                        {item.category} ({item.note})
                      </Text>

                      <Text style={styles.amountText}>Rs. {item.amount}</Text>
                    </View>
                  </View>
                ))
            )}
          </ScrollView>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("All")}
            style={[styles.tab, activeTab === "All" && styles.activeTab]}
          >
            <Text style={styles.tabText}>This Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("Today")}
            style={[styles.tab, activeTab === "Today" && styles.activeTab]}
          >
            <Text style={styles.tabText}>Past Month</Text>
          </TouchableOpacity>
        </View>

         <LineChart
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
        
      </ScrollView>

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
    paddingTop: 40,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  tab: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FF8C00",
  },
  tabText: {
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderLeftWidth: 6,
    elevation: 2,
  },
  cardHeader: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#444",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    width: "55%",
  },
  amountText: {
    fontWeight: "bold",
    color: "#333",
  },
});

export default ExpensesSection;
