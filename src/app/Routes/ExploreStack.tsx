import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ExploreStackNavigationParams } from "../types/navigation";
import Explore from "../Screens/Explore";
import PostDetail from "../Screens/Post";
import Profile from "../Screens/Profile";

const Stack = createStackNavigator<ExploreStackNavigationParams>();

const ExplorePageStack = () => {
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none" initialRouteName="Explore">
				<Stack.Screen name="Explore" component={Explore} />
				<Stack.Screen name="PostDetail" component={PostDetail} />
				<Stack.Screen name="ProfilePage" component={Profile} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default ExplorePageStack;
