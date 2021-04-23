import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Image, ToastAndroid, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
	Appbar,
	useTheme,
	TextInput,
	ActivityIndicator,
	Colors,
} from "react-native-paper";
import PostsStore from "../../store/PostsStore";
import { PostStackNavigationParams } from "../../types/navigation";
import usePostData from "../../utils/usePostData";

type Props = {
	route: RouteProp<PostStackNavigationParams, "EditPost">;
	navigation: StackNavigationProp<PostStackNavigationParams, "EditPost">;
};

const EditPost: React.FC<Props> = ({ route, navigation }) => {
	const { colors } = useTheme();
	const { post, user } = usePostData(route.params.postId);
	const [caption, setCaption] = useState(
		() => route.params.caption || post?.caption || ""
	);

	useEffect(() => {
		if (post && user && post.user !== user.username) {
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
			navigation.goBack();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [post, user]);

	useEffect(() => {
		if (post) setCaption(post.caption || "");
	}, [post]);

	const [loading, setLoading] = useState(false);
	const editPost = async () => {
		setLoading(true);
		try {
			await PostsStore.editPost(route.params.postId, caption);
			ToastAndroid.show("Post Updated", ToastAndroid.LONG);
			setLoading(false);
			navigation.goBack();
		} catch (err) {
			console.error(err);
			setLoading(false);
		}
	};
	const { width } = useWindowDimensions();

	return (
		<View
			style={{
				backgroundColor: colors.background,
				flex: 1,
			}}
		>
			{loading && (
				<View
					style={{
						width: "100%",
						height: "100%",
						justifyContent: "center",
						zIndex: 10,
						elevation: 10,
						backgroundColor: "rgba(0,0,0,0.6)",
						position: "absolute",
					}}
				>
					<ActivityIndicator
						animating={true}
						color={Colors.blue500}
						size={48}
					/>
				</View>
			)}
			<Appbar.Header
				style={{
					backgroundColor: colors.background,
				}}
			>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Edit Post" />
				<Appbar.Action icon="check" onPress={editPost} />
			</Appbar.Header>
			<ScrollView
				style={{
					flex: 1,
				}}
			>
				<Image
					source={{ uri: route.params.imageUrl || post?.imageUrl }}
					style={{
						width,
						height: width,
					}}
					width={width}
					height={width}
				/>

				<TextInput
					value={caption}
					onChangeText={(text) => setCaption(text)}
					maxLength={126}
					placeholder="Caption"
					textAlignVertical="center"
					style={{
						marginHorizontal: 16,
						marginTop: 16,
						marginBottom: 16,
					}}
				/>
			</ScrollView>
		</View>
	);
};

export default EditPost;
