import React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
	HomeStackNavigationParams,
	TabNavigationParams,
} from "../types/navigation";
import Comments from "../Screens/Comments";
import ProfilePageStack from "./ProfileStack";
import Home from "../Screens/Home";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

const Stack = createStackNavigator<HomeStackNavigationParams>();

type Props = {
	route: RouteProp<TabNavigationParams, "Home">;
	navigation: BottomTabNavigationProp<TabNavigationParams, "Home">;
	openMessages: () => void;
};

const HomePageStack: React.FC<Props> = ({ openMessages }) => (
	<NavigationContainer independent>
		<Stack.Navigator headerMode="none" initialRouteName="Home">
			<Stack.Screen name="Home">
				{(props) => <Home {...props} openMessages={openMessages} />}
			</Stack.Screen>
			<Stack.Screen name="Comments" component={Comments} />
			<Stack.Screen name="Profile" component={ProfilePageStack} />
		</Stack.Navigator>
	</NavigationContainer>
);

export default HomePageStack;
