import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import NewPost from "../Screens/NewPost";
import { BottomTabParamList } from "../types/navigation/BottomTab";
import Ionicons from "react-native-vector-icons/Ionicons";
import Foundation from "react-native-vector-icons/Foundation";
import Feather from "react-native-vector-icons/Feather";
import ProfilePageStack from "./ProfileStack";
import ExploreStackNavigator from "./ExploreStack";
import HomePageStack from "./HomeStack";
import ActivityStackNavigator from "./ActivityStack";
import { DeviceEventEmitter } from "react-native";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const TabBarIcon = ({ name, color }: { name: string; color: string }) => (
	<Ionicons
		style={{ backgroundColor: "transparent" }}
		name={name}
		color={color}
		size={24}
	/>
);

const BottomTabNavigator: React.FC<any> = () => {
	return (
		<BottomTab.Navigator
			initialRouteName="Home"
			tabBarOptions={{
				showLabel: false,
				tabStyle: { height: 48 },
			}}
		>
			<BottomTab.Screen
				name="Home"
				component={HomePageStack}
				listeners={{
					blur: (e) =>
						DeviceEventEmitter.emit("HomeTab", { type: e.type }),
					focus: (e) =>
						DeviceEventEmitter.emit("HomeTab", { type: e.type }),
				}}
				options={{
					tabBarIcon: ({ color, focused }) =>
						focused ? (
							<Foundation name={"home"} color={color} size={24} />
						) : (
							<Feather name={"home"} color={color} size={22} />
						),
				}}
			/>
			<BottomTab.Screen
				name="Explore"
				component={ExploreStackNavigator}
				options={{
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "search" : "search-outline"}
							color={color}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="New"
				component={NewPost}
				options={{
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "add-circle" : "add-outline"}
							color={color}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="Notifications"
				component={ActivityStackNavigator}
				options={{
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "heart" : "heart-outline"}
							color={color}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="CurrentUser"
				component={ProfilePageStack}
				options={{
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={
								focused
									? "person-circle"
									: "person-circle-outline"
							}
							color={color}
						/>
					),
				}}
			/>
		</BottomTab.Navigator>
	);
};

export default BottomTabNavigator;
