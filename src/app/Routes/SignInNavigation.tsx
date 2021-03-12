import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login";
import { SignInNavigationParams } from "../types/navigation";
import Signup from "../Screens/Login/Signup";

const Stack = createStackNavigator<SignInNavigationParams>();
const SignInStack = () => {
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none">
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Signup" component={Signup} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default SignInStack;
