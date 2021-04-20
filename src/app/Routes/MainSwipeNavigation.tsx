import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SwipeTabNavigationParams } from "../types/navigation";
import { TabNavigation } from "./Navigation";
import MessageStack from "./MessageStack";

const Tab = createMaterialTopTabNavigator<SwipeTabNavigationParams>();

const SwipeTabNavigation: React.FC<any> = () => (
	<NavigationContainer independent>
		<Tab.Navigator initialRouteName="Tabs" tabBar={() => null}>
			<Tab.Screen name="Tabs" component={TabNavigation} />
			<Tab.Screen name="Messages" component={MessageStack} />
		</Tab.Navigator>
	</NavigationContainer>
);

export default SwipeTabNavigation;
