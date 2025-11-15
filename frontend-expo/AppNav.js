import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/pages/Home";
import Login from "./src/landing/Login";
import Signup from "./src/landing/Signup";
import AcademicsDashboard from "./src/academics_stress/AcademicDashboard";
import LectureInfo from "./src/academics_stress/LectureInfo";
import { AuthContext } from "./src/context/AuthContext";
import StudyTimeTable from "./src/academics_stress/StudyTimeTable";

const Stack = createNativeStackNavigator();

export default function AppNav() {
    const { isLoading, userToken } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size={"large"} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken == null ? (
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Signup" component={Signup} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="AcademicDashboard" component={AcademicsDashboard} />
                        <Stack.Screen name="LectureInfo" component={LectureInfo} />
                        <Stack.Screen name="StudyTimeTable" component={StudyTimeTable} />
                        {/* Add other screens here */}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>

    );
}

const styles = StyleSheet.create({});
