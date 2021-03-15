import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../Screens/Profile";
import PostList from "../Screens/PostList";
import { ProfileStackParams } from "../types/navigation";
import Settings from "../Screens/Profile/Settings";
import EditProfile from "../Screens/Profile/Edit";

const Stack = createStackNavigator<ProfileStackParams>();

const ProfilePageStack = () => {
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none" initialRouteName="ProfilePage">
				<Stack.Screen
					name="ProfilePage"
					component={Profile}
					initialParams={{ isCurrentUser: true }}
				/>
				<Stack.Screen name="Posts" component={PostList} />
				<Stack.Screen name="EditProfile" component={EditProfile} />
				<Stack.Screen name="Settings" component={Settings} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default ProfilePageStack;
