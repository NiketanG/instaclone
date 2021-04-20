import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MessageStackNavigationParams } from "../types/navigation";

import Messages from "../Screens/Messages/Messages";
import MessagesList from "../Screens/Messages";

const Stack = createStackNavigator<MessageStackNavigationParams>();

const MessageStack = () => (
	<NavigationContainer independent>
		<Stack.Navigator headerMode="none" initialRouteName="MessageList">
			<Stack.Screen name="MessageList" component={MessagesList} />
			<Stack.Screen name="Messages" component={Messages} />
		</Stack.Navigator>
	</NavigationContainer>
);

export default MessageStack;
