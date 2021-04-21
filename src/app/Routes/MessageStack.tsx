import React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
	MessageStackNavigationParams,
	SwipeTabNavigationParams,
} from "../types/navigation";

import Messages from "../Screens/Messages/Messages";
import MessagesList from "../Screens/Messages";
import ProfilePageStack from "./ProfileStack";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import PostDetail from "../Screens/Post";
import Comments from "../Screens/Comments";

const Stack = createStackNavigator<MessageStackNavigationParams>();

type Props = {
	route: RouteProp<SwipeTabNavigationParams, "Messages">;
	navigation: MaterialTopTabNavigationProp<
		SwipeTabNavigationParams,
		"Messages"
	>;
};
const MessageStack: React.FC<Props> = ({ navigation }) => (
	<NavigationContainer independent>
		<Stack.Navigator headerMode="none" initialRouteName="MessageList">
			<Stack.Screen
				name="MessageList"
				component={MessagesList}
				initialParams={{ rootNavigation: navigation }}
			/>
			<Stack.Screen name="Messages" component={Messages} />
			<Stack.Screen name="Profile" component={ProfilePageStack} />
			<Stack.Screen name="Post" component={PostDetail} />
			<Stack.Screen name="Comments" component={Comments} />
		</Stack.Navigator>
	</NavigationContainer>
);

export default MessageStack;
