import { RouteProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import PostList from "../Screens/PostList";
import Profile from "../Screens/Profile";
import EditProfile from "../Screens/Profile/Edit";
import Followers from "../Screens/Profile/Followers";
import Following from "../Screens/Profile/Following";
import Settings from "../Screens/Profile/Settings";
import {
	ProfileStackNavigationProp,
	ProfileStackParams,
} from "../types/navigation/ProfileStack";
import { AppContext } from "../utils/appContext";

type Props = {
	route: RouteProp<ProfileStackParams, "Profile">;
	navigation: ProfileStackNavigationProp;
};

const Stack = createStackNavigator<ProfileStackParams>();

const ProfilePageStack: React.FC<Props> = ({ route }) => {
	const { user } = useContext(AppContext);
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName="Profile"
		>
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
