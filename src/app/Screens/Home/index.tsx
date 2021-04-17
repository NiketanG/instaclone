import React from "react";
import {
	RefreshControl,
	FlatList,
	StatusBar,
	View,
	useWindowDimensions,
} from "react-native";
import { ActivityIndicator, Divider, Text, useTheme } from "react-native-paper";
import { PostContainer } from "../../Components/PostContainer";
import { observer } from "mobx-react-lite";
import useFeed from "../../utils/useFeed";

const Home = observer(() => {
	const { colors, dark } = useTheme();

	const { fetchFeed, loading, posts: feedPosts } = useFeed();

	const { height } = useWindowDimensions();
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

			{loading && (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<ActivityIndicator color={colors.text} />
				</View>
			)}

			{!loading && feedPosts && (
				<FlatList
					ListEmptyComponent={
						<View
							style={{
								display: "flex",
								flexDirection: "column",
								height: height - (StatusBar.currentHeight || 0),
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text>Nothing to see here, yet.</Text>
						</View>
					}
					data={feedPosts
						.slice()
						.sort(
							(a, b) =>
								new Date(b.postedAt).getTime() -
								new Date(a.postedAt).getTime()
						)}
					ItemSeparatorComponent={Divider}
					renderItem={({ item }) => (
						<PostContainer
							item={{
								imageUrl: item.imageUrl,
								postId: item.postId,
								postedAt: item.postedAt,
								user: item.user,
								caption: item.caption,
							}}
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
							refreshing={loading}
							onRefresh={fetchFeed}
						/>
					}
				/>
			)}
		</View>
	);
});

export default Home;
