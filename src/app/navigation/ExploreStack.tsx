import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Explore from "../Screens/Explore";
import { ExploreStackNavigationParams } from "../types/navigation/ExploreStack";
import PostStack from "./PostStack";

const ExploreStack = createStackNavigator<ExploreStackNavigationParams>();

const ExploreStackNavigator: React.FC<any> = () => (
	<ExploreStack.Navigator
		screenOptions={{
			headerShown: false,
		}}
		initialRouteName="Explore"
	>
		<ExploreStack.Screen name="Explore" component={Explore} />
		<ExploreStack.Screen name="PostsList" component={PostStack} />
	</ExploreStack.Navigator>
);

export default ExploreStackNavigator;
