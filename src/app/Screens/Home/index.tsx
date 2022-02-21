import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef } from "react";
import {
	FlatList,
	RefreshControl,
	StatusBar,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import { Divider, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useQuery } from "react-query";
import { getFeedPosts, getFeedStories } from "../../../api";
import Error from "../../Components/Error";
import Post from "../../Components/Post";
import PostBottomSheetWrapper from "../../Components/PostBottomSheetWrapper";
import Stories from "../../Components/Story";
import { HomeStackNavigationParams } from "../../types/navigation/HomeStack";

type Props = {
	route: RouteProp<HomeStackNavigationParams, "Feed">;
	navigation: StackNavigationProp<HomeStackNavigationParams, "Feed">;
};

const Home: React.FC<Props> = ({ navigation }) => {
	const { colors, dark } = useTheme();

	const { width } = useWindowDimensions();

	const openMessages = () => navigation.navigate("Messages" as any);
	const openNewStory = () => navigation.navigate("NewStory" as any);

	const { data, error, refetch, isFetching } = useQuery("feedPosts", () =>
		getFeedPosts()
	);

	const feedRef = useRef<FlatList>(null);

	const {
		data: stories,
		error: storiesError,
		isLoading: storiesIsLoading,
		refetch: refetchStories,
	} = useQuery("feedStories", () => getFeedStories());

	return (
		<View
			style={{
				flex: 1,
				display: "flex",
				backgroundColor: colors.background,
			}}
		>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={dark ? "light-content" : "dark-content"}
				animated
			/>
			{error && <Error />}

			<View
				style={{
					height: 56,
					backgroundColor: colors.background,
					width,
					paddingHorizontal: 24,
					paddingVertical: 16,
					justifyContent: "space-between",
					display: "flex",
					flexDirection: "row",
				}}
			>
				<MaterialCommunityIcons
					name="plus"
					color="white"
					size={24}
					onPress={openNewStory}
				/>
				<Text
					onPress={() => {
						feedRef?.current?.scrollToOffset({
							offset: 0,
							animated: true,
						});
						refetchStories();
						refetch();
					}}
					style={{
						fontSize: 18,
						fontWeight: "bold",
						color: "white",
					}}
				>
					Instaclone
				</Text>
				<MaterialCommunityIcons
					name="send-outline"
					color="white"
					size={24}
					onPress={openMessages}
				/>
			</View>

			<FlatList
				ref={feedRef}
				ListHeaderComponent={
					<Stories
						error={storiesError}
						stories={stories}
						isLoading={storiesIsLoading}
					/>
				}
				ListEmptyComponent={
					<View
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							flexGrow: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text style={{ color: "white" }}>
							Nothing to see here, yet.
						</Text>
					</View>
				}
				data={data}
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
				style={{
					backgroundColor: colors.background,
				}}
				refreshControl={
					<RefreshControl
						refreshing={storiesIsLoading || isFetching}
						onRefresh={() => {
							refetchStories();
							refetch();
						}}
					/>
				}
			/>
			<PostBottomSheetWrapper />
		</View>
	);
};

export default Home;
