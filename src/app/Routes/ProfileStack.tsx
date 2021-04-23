import React, { useContext } from "react";
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
import Messages from "../Screens/Messages/Messages";
import { AppContext } from "../utils/appContext";

type Props = {
	route: RouteProp<ProfileStackParams, "ProfilePage">;
	navigation: StackNavigationProp<ProfileStackParams, "ProfilePage">;
};

const Stack = createStackNavigator<ProfileStackParams>();

const ProfilePageStack: React.FC<Props> = ({ route }) => {
	const currentUser = useContext(AppContext);
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none" initialRouteName="ProfilePage">
				<Stack.Screen
					name="ProfilePage"
					component={Profile}
					initialParams={{
						username: currentUser.username || undefined,
						...route.params,
					}}
				/>
				<Stack.Screen
					name="Followers"
					component={Followers}
					initialParams={{
						username: currentUser.username || undefined,
						...route.params,
					}}
				/>
				<Stack.Screen
					name="Following"
					component={Following}
					initialParams={{
						username: currentUser.username || undefined,
						...route.params,
					}}
				/>
				<Stack.Screen name="Posts" component={PostStack} />
				<Stack.Screen name="EditProfile" component={EditProfile} />
				<Stack.Screen name="Settings" component={Settings} />
				<Stack.Screen name="Messages" component={Messages} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default ProfilePageStack;
