import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Image, ToastAndroid, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
	Appbar,
	useTheme,
	TextInput,
	ActivityIndicator,
} from "react-native-paper";
import { useMutation, useQuery } from "react-query";
import { editPost, getPostById } from "../../../api";
import { PostStackParamsList } from "../../types/navigation/PostStack";
import { definitions } from "../../types/supabase";
import { AppContext } from "../../utils/appContext";
import { queryClient } from "../../utils/queryClient";

type Props = {
	route: RouteProp<PostStackParamsList, "EditPost">;
	navigation: StackNavigationProp<PostStackParamsList, "EditPost">;
};

const EditPost: React.FC<Props> = ({ route, navigation }) => {
	const { colors } = useTheme();

	const { data, isLoading } = useQuery(
		`postInfo_${route.params.postId}`,
		() => getPostById(route.params.postId),
		{
			enabled: route.params.postId !== null,
		}
	);
	const [caption, setCaption] = useState(
		() => route.params.caption || data?.caption || ""
	);

	const { user } = useContext(AppContext);
	useEffect(() => {
		if (!isLoading && user && data?.user?.username !== user.username) {
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
			navigation.goBack();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.user, user, isLoading]);

	useEffect(() => {
		if (data) setCaption(data.caption || "");
	}, [data]);

	const [loading, setLoading] = useState(false);

	const editPostMutation = useMutation<
		unknown,
		unknown,
		Pick<definitions["posts"], "caption" | "postId">
	>((post) => editPost(post), {
		onSettled: () => {
			queryClient.invalidateQueries(`feedPosts`);
			if (user)
				queryClient.invalidateQueries(`userInfo_${user.username}`);
		},
	});

	const postEdit = async () => {
		setLoading(true);
		try {
			editPostMutation.mutate({
				postId: route.params.postId,
				caption,
			});
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
					<ActivityIndicator animating={true} size={48} />
				</View>
			)}
			<Appbar.Header
				style={{
					backgroundColor: colors.background,
				}}
			>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Edit Post" />
				<Appbar.Action icon="check" onPress={postEdit} />
			</Appbar.Header>
			<ScrollView
				style={{
					flex: 1,
				}}
			>
				<Image
					source={{ uri: route.params.imageUrl || data?.imageUrl }}
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
