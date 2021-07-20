import { RouteProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Comments from "../Screens/Comments";
import Home from "../Screens/Home";
import Likes from "../Screens/Likes";
import PostDetail from "../Screens/Post";
import EditPost from "../Screens/Post/EditPost";
import PostList from "../Screens/PostList";
import { ExploreStackNavigationParams } from "../types/navigation/ExploreStack";
import { PostStackParamsList } from "../types/navigation/PostStack";
import ProfilePageStack from "./ProfileStack";

const Stack = createStackNavigator<PostStackParamsList>();

type Props = {
	route: RouteProp<ExploreStackNavigationParams, "PostsList">;
};
const PostStack: React.FC<Props> = ({ route }) => {
	return (
		<Stack.Navigator headerMode="none" initialRouteName="Feed">
			<Stack.Screen name="Feed" component={Home} />
			<Stack.Screen name="Comments" component={Comments} />
			<Stack.Screen name="EditPost" component={EditPost} />
			<Stack.Screen name="Likes" component={Likes} />
			<Stack.Screen
				name="PostsList"
				component={PostList}
				initialParams={route.params}
			/>
			<Stack.Screen name="Profile" component={ProfilePageStack} />
			<Stack.Screen name="Post" component={PostDetail} />
		</Stack.Navigator>
	);
};

export default PostStack;
