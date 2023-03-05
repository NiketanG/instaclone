import React, { useEffect, useRef } from "react";
import { Appbar, Divider, useTheme } from "react-native-paper";
import { FlatList, StatusBar, Text, useWindowDimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation/ProfileStack";
import { RouteProp } from "@react-navigation/native";
import Post from "../../Components/Post";
import { View } from "react-native";
import { PostWithUser } from "../../types";

type Props = {
	navigation: StackNavigationProp<ProfileStackParams, "PostsList">;
	route: RouteProp<ProfileStackParams, "PostsList">;
};

const PostList: React.FC<Props> = ({ navigation, route }) => {
	const listRef = useRef<FlatList>(null);
	const goBack = () => navigation.goBack();

	const { colors } = useTheme();

	useEffect(() => {
		if (route.params?.postId && route.params?.postList) {
			const postIndex = route.params.postList.findIndex(
				(post) => post.postId === route.params.postId
			);

			listRef.current?.scrollToIndex({
				index: postIndex,
				animated: false,
			});
		}
	}, [route]);

	const { width } = useWindowDimensions();

	const getItemLayout = (
		data: Array<PostWithUser> | null | undefined,
		index: number
	): {
		length: number;
		offset: number;
		index: number;
	} => {
		const postItemHeight = width + 234;
		return {
			index,
			length: postItemHeight,
			offset: postItemHeight * index,
		};
	};

	return (
		<>
			<StatusBar
				backgroundColor="black"
				barStyle="light-content"
				animated
			/>
			<Appbar.Header
				style={{
					zIndex: 5,
					elevation: 5,
					backgroundColor: "black",
				}}
			>
				<Appbar.BackAction onPress={goBack} />
				<Appbar.Content title="Posts" />
			</Appbar.Header>

			{route.params.postList && (
				<FlatList
					ref={listRef}
					getItemLayout={getItemLayout}
					ListEmptyComponent={
						<View
							style={{
								display: "flex",
								flexDirection: "column",

								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text>Nothing to see here, yet.</Text>
						</View>
					}
					data={route.params.postList}
					ItemSeparatorComponent={Divider}
					renderItem={({ item }) => (
						<Post
							caption={item.caption}
							imageUrl={item.imageUrl}
							postId={item.postId}
							postedAt={item.postedAt}
							user={item.user}
						/>
					)}
					keyExtractor={(item) => item.postId.toString()}
					bouncesZoom
					bounces
					snapToAlignment={"start"}
					style={{
						backgroundColor: colors.background,
					}}
				/>
			)}
		</>
	);
};

export default PostList;
