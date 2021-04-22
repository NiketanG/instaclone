import React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	SwipeTabNavigationParams,
	TabNavigationParams,
} from "../types/navigation";
import Icon from "react-native-vector-icons/Ionicons";

import ProfilePageStack from "./ProfileStack";
import NewPost from "../Screens/NewPost";
import { useTheme } from "react-native-paper";
import HomePageStack from "./HomeStack";
import ExplorePageStack from "./ExploreStack";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";

const Tab = createBottomTabNavigator<TabNavigationParams>();

const TabBarIcon = ({ name, color }: { name: string; color: string }) => (
	<Icon
		style={{ backgroundColor: "transparent" }}
		name={name}
		color={color}
		size={24}
	/>
);

type Props = {
	route: RouteProp<SwipeTabNavigationParams, "Tabs">;
	navigation: MaterialTopTabNavigationProp<SwipeTabNavigationParams, "Tabs">;
};
export const TabNavigation: React.FC<Props> = ({ navigation }) => {
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
					style: {
						backgroundColor: colors.background,
					},
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
					component={ExplorePageStack}
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
