import React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
	ExploreStackNavigationParams,
	TabNavigationParams,
} from "../types/navigation";
import Explore from "../Screens/Explore";
import PostDetail from "../Screens/Post";
import ProfilePageStack from "./ProfileStack";
import Comments from "../Screens/Comments";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import EditPost from "../Screens/Post/EditPost";

const Stack = createStackNavigator<ExploreStackNavigationParams>();

type Props = {
	route: RouteProp<TabNavigationParams, "Explore">;
	navigation: BottomTabNavigationProp<TabNavigationParams, "Explore">;
};

const ExplorePageStack: React.FC<Props> = () => {
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none" initialRouteName="Explore">
				<Stack.Screen name="Explore" component={Explore} />
				<Stack.Screen name="PostDetail" component={PostDetail} />
				<Stack.Screen name="Comments" component={Comments} />
				<Stack.Screen name="EditPost" component={EditPost} />
				<Stack.Screen name="Profile" component={ProfilePageStack} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default ExplorePageStack;
