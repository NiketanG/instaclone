import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeStackNavigationParams } from "../types/navigation";
import Comments from "../Screens/Comments";
import ProfilePageStack from "./ProfileStack";
import Home from "../Screens/Home";

const Stack = createStackNavigator<HomeStackNavigationParams>();

const HomePageStack = () => (
	<NavigationContainer independent>
		<Stack.Navigator headerMode="none" initialRouteName="Home">
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen name="Comments" component={Comments} />
			<Stack.Screen name="Profile" component={ProfilePageStack} />
		</Stack.Navigator>
	</NavigationContainer>
);

export default HomePageStack;
