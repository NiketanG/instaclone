import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect } from "react";
import NewStory from "../Screens/NewStory";
import { SwipeTabNavigationParams } from "../types/navigation/SwipeTab";
import BottomTabNavigator from "./BottomTabNavigator";
import MessageStack from "./MessageStack";
import { useState } from "react";
import { DeviceEventEmitter } from "react-native";

const Tab = createMaterialTopTabNavigator<SwipeTabNavigationParams>();

const SwipeTabNavigation: React.FC<any> = () => {
	const [swipeEnabled, setSwipeEnabled] = useState(true);

	// Only allow tab swipes on Home Screen
	const handler = (data: { type: "focus" | "blur" }) => {
		setSwipeEnabled(data.type === "blur" ? false : true);
	};
	useEffect(() => {
		const listener = DeviceEventEmitter.addListener("HomeTab", handler);

		return () => {
			listener.remove();
		};
	}, []);

	return (
		<Tab.Navigator
			initialRouteName="Tabs"
			tabBar={() => null}
			swipeEnabled={swipeEnabled}
		>
			<Tab.Screen name="NewStory" component={NewStory} />
			<Tab.Screen name="Tabs" component={BottomTabNavigator} />
			<Tab.Screen name="Messages" component={MessageStack} />
		</Tab.Navigator>
	);
};

export default SwipeTabNavigation;
