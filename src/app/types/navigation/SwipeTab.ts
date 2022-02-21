import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";

export type SwipeTabNavigationParams = {
	NewStory: undefined;
	Tabs: undefined;
	Messages: undefined;
};

export type TabsNavigationProp = MaterialTopTabNavigationProp<
	SwipeTabNavigationParams,
	"Tabs"
>;
