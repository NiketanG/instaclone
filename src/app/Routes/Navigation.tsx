import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home";
import { TabNavigationParams } from "../types/navigation";
import Icon from "react-native-vector-icons/Ionicons";

import Profile from "../Screens/Profile";
import Explore from "../Screens/Explore";
import SignedOutStack from "./SignedOutNavigation";
import ProfilePageStack from "./ProfileStack";
import NewPost from "../Screens/NewPost";
import { useTheme } from "react-native-paper";
import HomePageStack from "./HomeStack";

const Tab = createBottomTabNavigator<TabNavigationParams>();

const TabBarIcon = ({ name, color }: { name: string; color: string }) => (
	<Icon
		style={{ backgroundColor: "transparent" }}
		name={name}
		color={color}
		size={24}
	/>
);

export const TabNavigation = () => {
	const { colors, dark } = useTheme();
	return (
		<NavigationContainer
			independent
			theme={{
				colors: {
					background: colors.background,
					border: colors.placeholder,
					card: colors.surface,
					primary: colors.primary,
					text: colors.text,
					notification: colors.notification,
				},
				dark,
			}}
		>
			<Tab.Navigator
				tabBarOptions={{
					showLabel: false,
					keyboardHidesTabBar: true,
				}}
			>
				<Tab.Screen
					name="Home"
					component={HomePageStack}
					options={{
						tabBarIcon: ({ color, focused }) => (
							<TabBarIcon
								name={focused ? "home-sharp" : "home-outline"}
								color={color}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="Explore"
					component={Explore}
					options={{
						tabBarIcon: ({ color, focused }) => (
							<TabBarIcon
								name={focused ? "search" : "search-outline"}
								color={color}
							/>
						),
					}}
				/>
				<Tab.Screen
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
				<Tab.Screen
					name="Activity"
					component={Home}
					options={{
						tabBarIcon: ({ color, focused }) => (
							<TabBarIcon
								name={focused ? "heart" : "heart-outline"}
								color={color}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="Profile"
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
			</Tab.Navigator>
		</NavigationContainer>
	);
};

export default SignedOutStack;
