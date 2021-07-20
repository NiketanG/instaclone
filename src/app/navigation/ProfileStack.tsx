import React, { useContext } from "react";
import { RouteProp } from "@react-navigation/native";
import {
	createStackNavigator,
	StackNavigationProp,
} from "@react-navigation/stack";
import Profile from "../Screens/Profile";
import { ProfileStackParams } from "../types/navigation/ProfileStack";
import Settings from "../Screens/Profile/Settings";
import EditProfile from "../Screens/Profile/Edit";
import Followers from "../Screens/Profile/Followers";
import Following from "../Screens/Profile/Following";
import { AppContext } from "../utils/appContext";
import PostList from "../Screens/PostList";

type Props = {
	route: RouteProp<ProfileStackParams, "Profile">;
	navigation: StackNavigationProp<ProfileStackParams, "Profile">;
};

const Stack = createStackNavigator<ProfileStackParams>();

const ProfilePageStack: React.FC<Props> = ({ route }) => {
	const { user } = useContext(AppContext);
	return (
		<Stack.Navigator headerMode="none" initialRouteName="Profile">
			<Stack.Screen
				name="Profile"
				component={Profile}
				initialParams={{
					username: user?.username,
					profilePic: user?.profilePic,
					name: user?.name,
					...route.params,
				}}
			/>
			<Stack.Screen name="Followers" component={Followers} />
			<Stack.Screen name="Following" component={Following} />
			<Stack.Screen name="PostsList" component={PostList} />
			<Stack.Screen name="EditProfile" component={EditProfile} />
			<Stack.Screen name="Settings" component={Settings} />
		</Stack.Navigator>
	);
};

export default ProfilePageStack;
