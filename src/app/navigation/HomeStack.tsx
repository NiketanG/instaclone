import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { HomeStackNavigationParams } from "../types/navigation/HomeStack";
import PostStack from "./PostStack";

const Stack = createStackNavigator<HomeStackNavigationParams>();

const HomePageStack: React.FC<any> = () => (
	<Stack.Navigator
		screenOptions={{
			headerShown: false,
		}}
		initialRouteName="Feed"
	>
		<Stack.Screen name="Feed" component={PostStack} />
	</Stack.Navigator>
);

export default HomePageStack;
