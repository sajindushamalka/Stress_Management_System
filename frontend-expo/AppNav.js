import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/pages/Home";
import Login from "./src/landing/Login";
import Signup from "./src/landing/Signup";

import { AuthContext } from "./src/context/AuthContext";

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
        // <NavigationContainer>
        //     {userToken !== null ? (
        //         <Stack.Navigator screenOptions={{ headerShown: false }}>
        //             <Stack.Screen name="Home" component={Home} />
        //         </Stack.Navigator>
        //     ) : (
        //         <Stack.Navigator screenOptions={{ headerShown: false }}>
        //             <Stack.Screen name="Login" component={Login} />
        //             <Stack.Screen name="Signup" component={Signup} />
        //         </Stack.Navigator>
        //     )}
        // </NavigationContainer>
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
                        {/* Add other screens here */}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>

    );
}

const styles = StyleSheet.create({});
