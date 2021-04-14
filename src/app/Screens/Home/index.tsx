import React, { useContext, useEffect, useState } from "react";
import {
	RefreshControl,
	FlatList,
	StatusBar,
	ToastAndroid,
	View,
	useWindowDimensions,
} from "react-native";
import { ActivityIndicator, Divider, Text, useTheme } from "react-native-paper";
import { PostContainer } from "../../Components/PostContainer";
import { AppContext } from "../../utils/authContext";
import { observer } from "mobx-react-lite";
import PostsStore, { Post } from "../../store/PostsStore";
import { updatePostList } from "../../utils/utils";

const Home = observer(() => {
	const { colors, dark } = useTheme();
	const [loading, setLoading] = useState(true);
	const [feedPosts, setFeedPosts] = useState<Array<Post>>([]);
	const { username } = useContext(AppContext);

	const fetchOwnPosts = async () => {
		if (!username || username.length === 0) return;
		let ownPosts = null;
		try {
			ownPosts = await PostsStore.fetchPostsByUser(
				username.toLowerCase()
			);
			updatePostList(ownPosts);
		} catch (err) {
			console.error(err);

			ToastAndroid.show("Error retrieving posts", ToastAndroid.LONG);
		} finally {
			setLoading(false);
			return ownPosts;
		}
	};

	const fetchPosts = async () => {
		if (!username || username.length === 0) return;
		try {
			const posts: Post[] =
				(await PostsStore.getFeedPosts(username)) || [];
			const ownPosts = (await fetchOwnPosts()) || [];
			let temp: Post[] = [];

			temp = [...posts, ...ownPosts];
			setFeedPosts([...temp]);
		} catch (err) {
			console.error(err);
			ToastAndroid.show("Error retrieving posts", ToastAndroid.LONG);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);
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
							onRefresh={fetchPosts}
						/>
					}
				/>
			)}
		</View>
	);
});

export default Home;
