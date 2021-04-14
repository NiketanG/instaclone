import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ExploreStackNavigationParams } from "../types/navigation";
import Explore from "../Screens/Explore";
import PostDetail from "../Screens/Post";
import ProfilePageStack from "./ProfileStack";
import Comments from "../Screens/Comments";

const Stack = createStackNavigator<ExploreStackNavigationParams>();

const ExplorePageStack = () => {
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none" initialRouteName="Explore">
				<Stack.Screen name="Explore" component={Explore} />
				<Stack.Screen name="PostDetail" component={PostDetail} />
				<Stack.Screen name="Comments" component={Comments} />
				<Stack.Screen
					name="Profile"
					component={ProfilePageStack}
					initialParams={{ isCurrentUser: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default ExplorePageStack;
