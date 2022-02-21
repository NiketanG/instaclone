import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import PostStack from "./PostStack";
import ProfilePageStack from "./ProfileStack";
import ChatList from "../Screens/Messages/ChatList";
import Messages from "../Screens/Messages/Messages";
import NewChat from "../Screens/Messages/NewChat";
import { MessageStackNavigationParams } from "../types/navigation/MessagesStack";
import { DeviceEventEmitter } from "react-native";

const Stack = createStackNavigator<MessageStackNavigationParams>();

const MessageStack: React.FC<any> = () => (
	<Stack.Navigator
		screenOptions={{
			headerShown: false,
		}}
		initialRouteName="ChatList"
	>
		<Stack.Screen
			name="ChatList"
			component={ChatList}
			listeners={{
				blur: (e) =>
					DeviceEventEmitter.emit("HomeTab", { type: e.type }),
				focus: (e) =>
					DeviceEventEmitter.emit("HomeTab", { type: e.type }),
			}}
		/>
		<Stack.Screen name="Messages" component={Messages} />
		<Stack.Screen name="NewChat" component={NewChat} />
		<Stack.Screen name="Post" component={PostStack} />
		<Stack.Screen name="Profile" component={ProfilePageStack} />
	</Stack.Navigator>
);

export default MessageStack;
