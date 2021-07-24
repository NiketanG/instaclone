import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import PostStack from "./PostStack";
import ProfilePageStack from "./ProfileStack";
import ChatList from "../Screens/Messages/ChatList";
import Messages from "../Screens/Messages/Messages";
import NewChat from "../Screens/Messages/NewChat";
import { MessageStackNavigationParams } from "../types/navigation/MessagesStack";

const Stack = createStackNavigator<MessageStackNavigationParams>();

const MessageStack: React.FC<any> = () => (
	<Stack.Navigator headerMode="none" initialRouteName="ChatList">
		<Stack.Screen name="ChatList" component={ChatList} />
		<Stack.Screen name="Messages" component={Messages} />
		<Stack.Screen name="NewChat" component={NewChat} />
		<Stack.Screen name="Post" component={PostStack} />
		<Stack.Screen name="Profile" component={ProfilePageStack} />
	</Stack.Navigator>
);

export default MessageStack;
