import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    Dimensions,
    Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { AuthContext } from "../context/AuthContext";
import Node from "../api/node/Node";
import { LineChart } from "react-native-chart-kit";


const ScoialDashboard = () => {
    const { userDetails } = useContext(AuthContext);
    const navigation = useNavigation();
    const [prevRecords, setPrevRecords] = useState([]);

    const screenWidth = Dimensions.get("window").width;

    const labelToValue = {
        "Low": 1,
        "Medium": 2,
        "High": 3
    };

    const [chartLabels, setChartLabels] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        Node.get(`/soical/get/${userDetails.RegisterdUser.email}`)
            .then((res) => {
                const data = res.data.data;

                setPrevRecords(data);

                // Sort records by date ascending (oldest → newest)
                const sorted = data.sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                );

                // Convert predicted_label → numeric
                const values = sorted.map(item => labelToValue[item.predicted_label]);

                // Format date labels: e.g. 20 Nov
                const labels = sorted.map(item => {
                    const d = new Date(item.date);
                    return d.getDate() + "/" + (d.getMonth() + 1);
                });

                setChartLabels(labels);
                setChartData(values);
            })
            .catch((err) => console.log(err));
    }, []);


    console.log(prevRecords)

    return (
        <LinearGradient colors={["#ffffffff", "#f3ddc3ff"]} style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.heading}>Social Monitor</Text>


                {/* Display all events below calendar */}
                <View style={{ margin: 10 }}>
                    {chartData.length > 0 && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
                                Stress Level Last 7 Days
                            </Text>

                            <LineChart
                                data={{
                                    labels: chartLabels,
                                    datasets: [
                                        {
                                            data: chartData
                                        }
                                    ]
                                }}
                                width={screenWidth - 20}
                                height={260}
                                yAxisInterval={1}
                                chartConfig={{
                                    backgroundColor: "#ffffff",
                                    backgroundGradientFrom: "#fbe8d3",
                                    backgroundGradientTo: "#f0c9a7",
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(255, 120, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    propsForDots: {
                                        r: "5",
                                        strokeWidth: "2",
                                        stroke: "#ffa726",
                                    },
                                }}
                                style={{
                                    marginVertical: 20,
                                    borderRadius: 16,
                                    paddingRight: 35
                                }}
                                bezier
                            />
                        </View>
                    )}

                </View>

                {/* Bottom buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate("FriendDashboard")}
                    >
                        <FontAwesome name="user" size={28} color="#FF8C00" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate("PredictStress")}>
                        <FontAwesome name="search" size={28} color="#FF8C00" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate("SocailNotification")}
                    >
                        <FontAwesome name="calendar" size={28} color="#FF8C00" />
                    </TouchableOpacity>
                </View>
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
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        paddingTop: 40
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
});

export default ScoialDashboard;
