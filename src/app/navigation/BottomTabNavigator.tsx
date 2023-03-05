/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import NewPost from "../Screens/NewPost";
import { BottomTabParamList } from "../types/navigation/BottomTab";
import ActivityStackNavigator from "./ActivityStack";
import ExploreStackNavigator from "./ExploreStack";
import HomePageStack from "./HomeStack";
import ProfilePageStack from "./ProfileStack";

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
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: false,
				tabBarInactiveTintColor: "gray",
			}}
		>
			<BottomTab.Screen
				name="Home"
				component={HomePageStack}
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
				component={ProfilePageStack as any}
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
