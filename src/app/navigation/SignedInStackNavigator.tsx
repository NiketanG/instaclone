import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SwipeTabNavigation from "./MainSwipeNavigation";
import { RootStackParamList } from "../types/navigation/RootStack";

const RootStack = createStackNavigator<RootStackParamList>();

const SignedInStack = () => {
	return (
		<RootStack.Navigator
			headerMode="none"
			screenOptions={{ headerShown: false }}
		>
			<RootStack.Screen name="Root" component={SwipeTabNavigation} />
		</RootStack.Navigator>
	);
};

export default SignedInStack;
