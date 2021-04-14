import React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
	createStackNavigator,
	StackNavigationProp,
} from "@react-navigation/stack";
import Profile from "../Screens/Profile";
import { ProfileStackParams } from "../types/navigation";
import Settings from "../Screens/Profile/Settings";
import EditProfile from "../Screens/Profile/Edit";
import Followers from "../Screens/Profile/Followers";
import Following from "../Screens/Profile/Following";
import PostStack from "./PostStack";

type Props = {
	route: RouteProp<ProfileStackParams, "ProfilePage">;
	navigation: StackNavigationProp<ProfileStackParams, "ProfilePage">;
};

const Stack = createStackNavigator<ProfileStackParams>();

const ProfilePageStack = (props: Props) => {
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none" initialRouteName="ProfilePage">
				<Stack.Screen
					name="ProfilePage"
					component={Profile}
					initialParams={{
						isCurrentUser: true,
						...props.route.params,
					}}
				/>
				<Stack.Screen
					name="Followers"
					component={Followers}
					initialParams={{
						isCurrentUser: true,
						...props.route.params,
					}}
				/>
				<Stack.Screen
					name="Following"
					component={Following}
					initialParams={{
						isCurrentUser: true,
						...props.route.params,
					}}
				/>
				<Stack.Screen name="Posts" component={PostStack} />
				<Stack.Screen name="EditProfile" component={EditProfile} />
				<Stack.Screen name="Settings" component={Settings} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default ProfilePageStack;
