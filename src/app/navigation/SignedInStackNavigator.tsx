import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useEffect } from "react";
import { setNotificationToken } from "../../api";
import StoryView from "../Screens/StoryView";
import { RootStackParamList } from "../types/navigation/RootStack";
import SwipeTabNavigation from "./MainSwipeNavigation";
import messaging from "@react-native-firebase/messaging";
import PostMenu from "../Screens/PostMenu";
import PostShareMenu from "../Screens/PostMenu/Share";
import OwnStorySheet from "../Screens/StoryView/OwnStorySheet";
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
			screenOptions={{
				headerShown: false,
			}}
		>
			<RootStack.Screen name="Root" component={SwipeTabNavigation} />
			<RootStack.Screen name="ViewStory" component={StoryView} />
			<RootStack.Screen
				name="StorySheet"
				component={OwnStorySheet}
				options={{
					headerShown: false,
					presentation: "transparentModal",
					animationEnabled: false,
					cardStyle: {
						backgroundColor: "transparent",
					},
				}}
			/>
			<RootStack.Screen
				name="PostMenu"
				component={PostMenu}
				options={{
					headerShown: false,
					presentation: "transparentModal",
					animationEnabled: false,
					cardStyle: {
						backgroundColor: "transparent",
					},
				}}
			/>
			<RootStack.Screen
				name="PostShareMenu"
				component={PostShareMenu}
				options={{
					headerShown: false,
					presentation: "transparentModal",
					animationEnabled: false,
					cardStyle: {
						backgroundColor: "transparent",
					},
				}}
			/>
		</RootStack.Navigator>
	);
};

export default SignedInStack;
