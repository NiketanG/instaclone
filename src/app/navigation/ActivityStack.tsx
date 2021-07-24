import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Activity from "../Screens/Activity";
import { ActivityStackNavigationParams } from "../types/navigation/ActivityStack";
import PostStack from "./PostStack";
import ProfilePageStack from "./ProfileStack";

const ActivityStack = createStackNavigator<ActivityStackNavigationParams>();

const ActivityStackNavigator: React.FC<any> = () => (
	<ActivityStack.Navigator headerMode="none" initialRouteName="Notifications">
		<ActivityStack.Screen name="Notifications" component={Activity} />
		<ActivityStack.Screen name="Post" component={PostStack} />
		<ActivityStack.Screen name="Profile" component={ProfilePageStack} />
	</ActivityStack.Navigator>
);

export default ActivityStackNavigator;
