import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login";
import SwipeTabNavigation from "./MainSwipeNavigation";
import { SignedOutStackParams } from "../types/navigation";

const Stack = createStackNavigator<SignedOutStackParams>();
const SignedInStack = () => (
	<NavigationContainer independent>
		<Stack.Navigator headerMode="none" initialRouteName="SwipeTabs">
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="SwipeTabs" component={SwipeTabNavigation} />
		</Stack.Navigator>
	</NavigationContainer>
);

export default SignedInStack;
