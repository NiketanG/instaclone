import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Appbar, useTheme } from "react-native-paper";
import Post from "../../Components/Post";
import { ExploreStackNavigationParams } from "../../types/navigation";

type Props = {
	route: RouteProp<ExploreStackNavigationParams, "PostDetail">;
	navigation: StackNavigationProp<ExploreStackNavigationParams, "PostDetail">;
};

const PostDetail: React.FC<Props> = ({ route, navigation }) => {
	const { colors } = useTheme();
	return (
		<>
			<Appbar.Header
				style={{
					backgroundColor: colors.background,
				}}
			>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Post" />
			</Appbar.Header>
			<Post
				caption={route.params.post.caption}
				imageUrl={route.params.post.imageUrl}
				postId={route.params.post.postId}
				postedAt={route.params.post.postedAt}
				user={route.params.user}
				likes={0}
			/>
		</>
	);
};

export default PostDetail;