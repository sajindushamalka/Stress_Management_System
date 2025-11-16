import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { AuthContext } from "../context/AuthContext";
import Node from "../api/node/Node";

const FriendDashboard = () => {
    const { userDetails } = useContext(AuthContext);
    const navigation = useNavigation();

    const [activeTab, setActiveTab] = useState("find");
    const [allUsers, setAllUsers] = useState([]);
    const [mySentRequests, setMySentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);

    // useEffect(() => {

    //     // Get all users
    //     Node.get("/user/all")
    //         .then((res) => setAllUsers(res.data))
    //         .catch((err) => console.log(err));

    //     // Get all friend requests for logged-in user
    //     Node.get(`/friend/get`)
    //         .then((res) => {
    //             setMySentRequests(res.data.filter((x) => x.sender === userDetails.RegisterdUser.email));
    //             setReceivedRequests(res.data.filter((x) => x.receiver === userDetails.RegisterdUser.email));
    //         })
    //         .catch((err) => console.log(err));

    // }, []);

    useEffect(() => {
        // Get all users
        Node.get("/user/all")
            .then((res) => {
                const users = res.data;
                const myEmail = userDetails.RegisterdUser.email;

                // Now fetch friend request data
                Node.get("/friend/get")
                    .then((res2) => {
                        const allRequests = res2.data;

                        const mySent = allRequests.filter(
                            (x) => x.sender === myEmail
                        );

                        const myReceived = allRequests.filter(
                            (x) => x.receiver === myEmail
                        );

                        setMySentRequests(mySent);
                        setReceivedRequests(myReceived);

                        // Email lists to remove
                        const sentEmails = mySent.map((x) => x.receiver);
                        const receivedEmails = myReceived.map((x) => x.sender);

                        // FINAL FILTERED USERS
                        const filteredUsers = users.filter(
                            (u) =>
                                u.email !== myEmail &&               // remove me
                                !sentEmails.includes(u.email) &&     // remove I already sent requests to
                                !receivedEmails.includes(u.email)    // remove people who sent requests to me
                        );

                        setAllUsers(filteredUsers);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }, []);


    const requestFriend = (email, fullName) => {
        const payload = {
            sender: userDetails.RegisterdUser.email,
            receiver: email,
            status: "Requested",
            sender_fullname: userDetails.RegisterdUser.full_name,
            receiver_fullname: fullName
        };
        Node.post("/friend/add", payload)
            .then((res) => console.log("Friend Request Sent:", res.data))
            .catch((err) => console.log(err));
    };

    const acceptFriend = (id) => {
        Node.put(`/friend/accept/${id}`)
            .then((res) => console.log("Friend Accepted:", res.data))
            .catch((err) => console.log(err));
    };

    const removeFriendRequest = (id) => {
        Node.delete(`/friend/remove/${id}`)
            .then((res) => console.log("Friend Request Removed"))
            .catch((err) => console.log(err));
    };

    // 🔥 Tab content generator
    const renderList = () => {
        let listData = [];

        if (activeTab === "find") {
            listData = allUsers;
        }
        if (activeTab === "myRequests") {
            listData = mySentRequests;
        }
        if (activeTab === "newRequests") {
            listData = receivedRequests;
        }

        return listData.map((item) => (
            <View key={item._id} style={styles.friendCard}>
                <FontAwesome
                    name="user-circle"
                    size={40}
                    color="#FF8C00"
                    style={{ marginRight: 10 }}
                />

                <View style={{ flex: 1 }}>
                    <Text style={styles.friendName}>
                        {activeTab === "find"
                            ? item.full_name
                            : activeTab === "myRequests"
                                ? item.receiver_fullname
                                : item.sender_fullname}
                    </Text>

                    <Text style={styles.friendEmail}>
                        {activeTab === "find"
                            ? item.email
                            : activeTab === "myRequests"
                                ? item.receiver
                                : item.sender}
                    </Text>
                </View>

                {activeTab === "find" && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => requestFriend(item.email, item.full_name)}
                    >
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                )}

                {activeTab === "myRequests" && (
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFriendRequest(item._id)}
                    >
                        <Text style={styles.addButtonText}>Remove</Text>
                    </TouchableOpacity>
                )}

                {activeTab === "newRequests" && (
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => acceptFriend(item._id)}
                    >
                        <Text style={styles.addButtonText}>Accept</Text>
                    </TouchableOpacity>
                )}
            </View>
        ));
    };

    return (
        <LinearGradient colors={["#fff", "#f3ddc3"]} style={styles.container}>
            <Header />

            {/* 🔥 TAB SWITCHER */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    onPress={() => setActiveTab("find")}
                    style={[
                        styles.tabButton,
                        activeTab === "find" && styles.activeTab
                    ]}
                >
                    <Text style={styles.tabText}>Find Friends</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab("myRequests")}
                    style={[
                        styles.tabButton,
                        activeTab === "myRequests" && styles.activeTab
                    ]}
                >
                    <Text style={styles.tabText}>My Requests</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab("newRequests")}
                    style={[
                        styles.tabButton,
                        activeTab === "newRequests" && styles.activeTab
                    ]}
                >
                    <Text style={styles.tabText}>New Requests</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {renderList()}
            </ScrollView>

            <Footer />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 30 },
    contentContainer: { paddingHorizontal: 20, paddingBottom: 100 },

    tabRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        backgroundColor: "#ffe8cc",
    },

    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
    },

    activeTab: {
        backgroundColor: "#FF8C00",
    },

    tabText: {
        color: "#333",
        fontWeight: "bold",
    },

    friendCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 12,
        marginVertical: 6,
        borderRadius: 10,
        elevation: 3,
    },

    friendName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },

    friendEmail: {
        fontSize: 14,
        color: "#777",
    },

    addButton: {
        backgroundColor: "#FF8C00",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
    },

    acceptButton: {
        backgroundColor: "green",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
    },

    removeButton: {
        backgroundColor: "red",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
    },

    addButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default FriendDashboard;
