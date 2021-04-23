import React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
	createStackNavigator,
	StackNavigationProp,
} from "@react-navigation/stack";
import {
	PostStackNavigationParams,
	ProfileStackParams,
} from "../types/navigation";
import Comments from "../Screens/Comments";
import PostList from "../Screens/PostList";
import ProfilePageStack from "./ProfileStack";
import EditPost from "../Screens/Post/EditPost";
import Likes from "../Screens/Likes";

const Stack = createStackNavigator<PostStackNavigationParams>();

type Props = {
	route: RouteProp<ProfileStackParams, "Posts">;
	navigation: StackNavigationProp<ProfileStackParams, "Posts">;
};
const PostStack = ({ route: { params } }: Props) => {
	return (
		<NavigationContainer independent>
			<Stack.Navigator headerMode="none" initialRouteName="PostList">
				<Stack.Screen
					name="PostList"
					component={PostList}
					initialParams={params}
				/>
				<Stack.Screen name="Comments" component={Comments} />
				<Stack.Screen name="Profile" component={ProfilePageStack} />
				<Stack.Screen name="EditPost" component={EditPost} />
				<Stack.Screen name="Likes" component={Likes} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default PostStack;
