import React from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SwipeTabNavigationParams } from "../types/navigation/SwipeTab";
import MessageStack from "../Routes/MessageStack";
import BottomTabNavigator from "./BottomTabNavigator";

const Tab = createMaterialTopTabNavigator<SwipeTabNavigationParams>();

const SwipeTabNavigation: React.FC<any> = () => (
	<Tab.Navigator initialRouteName="Tabs" tabBar={() => null}>
		<Tab.Screen name="Tabs" component={BottomTabNavigator} />
		<Tab.Screen name="Messages" component={MessageStack} />
	</Tab.Navigator>
);

export default SwipeTabNavigation;
