import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { AuthContext } from "../context/AuthContext";
import Node from "../api/node/Node";

const MLGenaratedTimeTable = () => {
    const { userDetails } = useContext(AuthContext);

    const [events, setEvents] = useState({});               // Marked dates for calendar
    const [scheduleByDate, setScheduleByDate] = useState({}); // Sessions grouped by date
    const [selectedDate, setSelectedDate] = useState("");     // Current selected date
    const today = new Date().toISOString().split("T")[0];     // YYYY-MM-DD

    useEffect(() => {
        Node.get(`/timetable/get/${userDetails.RegisterdUser.email}`)
            .then((res) => {
                const schedule = res.data.schedule;

                // Group sessions by date
                const grouped = {};
                schedule.forEach((item) => {
                    if (!grouped[item.date]) grouped[item.date] = [];
                    grouped[item.date].push(item);
                });

                setScheduleByDate(grouped);

                // Calendar marking
                const marks = {};
                Object.keys(grouped).forEach((date) => {
                    marks[date] = {
                        marked: true,
                        dotColor: "#f57c00",
                        selected: date === today,
                        selectedColor: "#ffd9b3"
                    };
                });

                setEvents(marks);

                // Default: show today's data
                setSelectedDate(today);

            })
            .catch((err) => {
                console.log("Error loading schedule:", err);
            });
    }, []);

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    return (
        <LinearGradient colors={["#ffffffff", "#f3ddc3ff"]} style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.heading}>My Timetable</Text>

                <Calendar
                    markingType="dot"
                    markedDates={{
                        ...events,
                        [selectedDate]: {
                            selected: true,
                            selectedColor: "#f57c00",
                            marked: events[selectedDate]?.marked,
                            dotColor: "#fff"
                        }
                    }}
                    onDayPress={handleDayPress}
                    theme={{
                        calendarBackground: "white",
                        textSectionTitleColor: "#2E3A59",
                        todayTextColor: "#f57c00",
                        dayTextColor: "#2E3A59",
                        arrowColor: "#f57c00",
                        monthTextColor: "#f57c00",
                    }}
                    style={{ borderRadius: 10, margin: 10, elevation: 3 }}
                />

                {/* Selected date label */}
                <Text style={styles.selectedDateText}>
                    📅 {selectedDate}
                </Text>

                {/* Display schedule for selected date */}
                <View style={styles.eventBox}>
                    {scheduleByDate[selectedDate] ? (
                        scheduleByDate[selectedDate].map((item, index) => (
                            <View key={index} style={styles.eventCard}>
                                <Text style={styles.eventTitle}>{item.lecture_name}</Text>
                                <Text style={styles.eventDetail}>Module: {item.module_name}</Text>
                                <Text style={styles.eventDetail}>
                                    Time: {item.start_time} → {item.end_time}
                                </Text>
                                <Text style={styles.eventDetail}>Priority: {item.priority}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noEventText}>No events for this date.</Text>
                    )}
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
        paddingTop: 40,
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    selectedDateText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "600",
        marginVertical: 10,
        color: "#333",
    },
    eventBox: {
        marginTop: 10,
        padding: 10,
    },
    eventCard: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#f57c00",
    },
    eventDetail: {
        fontSize: 14,
        color: "#555",
        marginTop: 3,
    },
    noEventText: {
        textAlign: "center",
        fontSize: 16,
        color: "#555",
        marginTop: 20,
    },
});

export default MLGenaratedTimeTable;
