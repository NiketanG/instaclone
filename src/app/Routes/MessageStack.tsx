import React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
	MessageStackNavigationParams,
	SwipeTabNavigationParams,
} from "../types/navigation";

import Messages from "../Screens/Messages/Messages";
import ChatList from "../Screens/Messages/ChatList";
import ProfilePageStack from "./ProfileStack";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import PostDetail from "../Screens/Post";
import Comments from "../Screens/Comments";
import NewChat from "../Screens/Messages/NewChat";
import EditPost from "../Screens/Post/EditPost";
import Likes from "../Screens/Likes";

const Stack = createStackNavigator<MessageStackNavigationParams>();

type Props = {
	route: RouteProp<SwipeTabNavigationParams, "Messages">;
	navigation: MaterialTopTabNavigationProp<
		SwipeTabNavigationParams,
		"Messages"
	>;
};
const MessageStack: React.FC<Props> = ({ navigation }) => {
	const goBack = () => navigation.goBack();
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none" initialRouteName="ChatList">
				<Stack.Screen name="ChatList">
					{(props) => <ChatList {...props} goBack={goBack} />}
				</Stack.Screen>
				<Stack.Screen name="Messages" component={Messages} />
				<Stack.Screen name="NewChat" component={NewChat} />
				<Stack.Screen name="Profile" component={ProfilePageStack} />
				<Stack.Screen name="Post" component={PostDetail} />
				<Stack.Screen name="EditPost" component={EditPost} />
				<Stack.Screen name="Comments" component={Comments} />
				<Stack.Screen name="Likes" component={Likes} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default MessageStack;
