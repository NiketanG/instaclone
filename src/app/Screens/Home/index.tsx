import React from "react";
import {
	RefreshControl,
	FlatList,
	StatusBar,
	View,
	useWindowDimensions,
} from "react-native";
import {
	ActivityIndicator,
	Appbar,
	Divider,
	Text,
	useTheme,
} from "react-native-paper";
import { PostContainer } from "../../Components/PostContainer";
import { observer } from "mobx-react-lite";
import useFeed from "../../utils/useFeed";
import { HomeStackNavigationParams } from "../../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = {
	route: RouteProp<HomeStackNavigationParams, "Home">;
	navigation: StackNavigationProp<HomeStackNavigationParams, "Home">;
};

const Home: React.FC<Props> = observer(({ route }) => {
	const { colors, dark } = useTheme();

	const { fetchFeed, loading, posts: feedPosts } = useFeed();

	const { height } = useWindowDimensions();

	const openMessages = () =>
		route.params.rootNavigation?.navigate("Messages");

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
			<Appbar.Header
				style={{
					backgroundColor: colors.background,
				}}
			>
				<Appbar.Content title="Instaclone" />

				<Appbar.Action icon="send-outline" onPress={openMessages} />
			</Appbar.Header>

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
