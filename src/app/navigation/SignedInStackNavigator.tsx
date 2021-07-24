import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useEffect } from "react";
import { setNotificationToken } from "../../api";
import StoryView from "../Screens/StoryView";
import { RootStackParamList } from "../types/navigation/RootStack";
import SwipeTabNavigation from "./MainSwipeNavigation";
import messaging from "@react-native-firebase/messaging";
const RootStack = createStackNavigator<RootStackParamList>();

const SignedInStack = () => {
	useEffect(() => {
		messaging()
			.getToken()
			.then((token) => {
				return setNotificationToken(token);
			});
	}, []);
	return (
		<RootStack.Navigator
			headerMode="none"
			screenOptions={{ headerShown: false }}
		>
			<RootStack.Screen name="Root" component={SwipeTabNavigation} />
			<RootStack.Screen name="ViewStory" component={StoryView} />
		</RootStack.Navigator>
	);
};

export default SignedInStack;
