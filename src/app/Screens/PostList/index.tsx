import React, { useEffect, useRef } from "react";
import { Appbar, Divider, useTheme } from "react-native-paper";
import { FlatList, StatusBar, useWindowDimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { PostContainer } from "../../Components/PostContainer";
import { definitions } from "../../types/supabase";

type Props = {
	navigation: StackNavigationProp<ProfileStackParams, "Posts">;
	route: RouteProp<ProfileStackParams, "Posts">;
};

const PostList: React.FC<Props> = ({ navigation, route }) => {
	const listRef = useRef<FlatList>(null);
	const goBack = () => {
		if (route.params.goBack) {
			route.params.goBack();
		} else {
			navigation.goBack();
		}
	};

	const { colors } = useTheme();

	useEffect(() => {
		if (route.params?.postId && route.params?.postList) {
			const postIndex = route.params.postList.findIndex(
				(post) => post.postId === route.params.postId
			);

			listRef.current?.scrollToIndex({
				index: postIndex,
			});
		}
	}, [route]);

	const { width } = useWindowDimensions();

	const getItemLayout = (
		data: Array<definitions["posts"]> | null | undefined,
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
					data={route.params.postList.sort(
						(a, b) =>
							new Date(b.postedAt).getTime() -
							new Date(a.postedAt).getTime()
					)}
					ItemSeparatorComponent={Divider}
					renderItem={({ item }) => <PostContainer item={item} />}
					keyExtractor={(item) => item.postId.toString()}
					bouncesZoom
					bounces
					snapToAlignment={"start"}
					showsVerticalScrollIndicator
					style={{
						backgroundColor: colors.background,
					}}
				/>
			)}
		</>
	);
};

export default PostList;
