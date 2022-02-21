import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login";
import { SignInNavigationParams } from "../types/navigation/SignInStack";
import Signup from "../Screens/Login/Signup";

const SignInStack = createStackNavigator<SignInNavigationParams>();
const SignInStackNavigator = () => {
	return (
		<SignInStack.Navigator
			screenOptions={{
				headerShown: false,
				cardStyle: { backgroundColor: "transparent" },
			}}
		>
			<SignInStack.Screen name="Login" component={Login} />
			<SignInStack.Screen name="Signup" component={Signup} />
		</SignInStack.Navigator>
	);
};

export default SignInStackNavigator;
