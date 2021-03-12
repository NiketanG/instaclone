import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login";
import { ParentStackParams } from "../types/navigation";
import { TabNavigation } from "./Navigation";

const Stack = createStackNavigator<ParentStackParams>();
const SignedOutStack = () => {
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none" initialRouteName="Tabs">
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Tabs" component={TabNavigation} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default SignedOutStack;
