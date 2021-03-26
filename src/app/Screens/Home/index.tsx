import React, { useContext, useEffect, useState } from "react";
import {
	RefreshControl,
	FlatList,
	StatusBar,
	ToastAndroid,
	View,
} from "react-native";
import { ActivityIndicator, Divider, Text, useTheme } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import mapPosts from "../../utils/mapPosts";
import { PostContainer } from "../../Components/PostContainer";
import { AppContext } from "../../utils/authContext";
import { observer } from "mobx-react-lite";
import PostsStore from "../../store/PostsStore";
import { fetchPostByUser, updatePostList } from "../../utils/utils";

const Home = observer(() => {
	const { colors, dark } = useTheme();
	const [loading, setLoading] = useState(true);

	// const [posts, setPosts] = useState<Array<PostType> | null>(null);
	const followersCollection = firestore().collection("followers");
	const postsCollection = firestore().collection("posts");
	const { username } = useContext(AppContext);

	const fetchOwnPosts = async () => {
		if (!username || username.length === 0) return;
		try {
			const ownPosts = await fetchPostByUser(username.toLowerCase());
			updatePostList(ownPosts);
		} catch (err) {
			console.error(err);
			ToastAndroid.show("Error retrieving posts", ToastAndroid.LONG);
		} finally {
			setLoading(false);
		}
	};

	const fetchPosts = async () => {
		if (!username || username.length === 0) return;

		try {
			const followingRes = await followersCollection
				.where("follower", "==", username)
				.get();

			if (followingRes.docs.length === 0) {
				ToastAndroid.show(
					"Follow someone to see their posts.",
					ToastAndroid.LONG
				);
				// setPosts([]);
				return;
			}

			followingRes.docs.forEach((user) => {
				if (user.get("following")) {
					postsCollection
						.where("following", "==", user.get("following"))
						.get()
						.then((post) => {
							if (post.docs.length > 0) {
								const mappedPosts = mapPosts(post);

								updatePostList(mappedPosts);
							}
						});
				}
			});

			await fetchOwnPosts();
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

	return (
		<View
			style={{
				flex: 1,
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
			{!loading && PostsStore.posts.length === 0 && (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text>Nothing to see here, yet.</Text>
				</View>
			)}

			{!loading && PostsStore.posts && PostsStore.posts.length > 0 && (
				<FlatList
					data={PostsStore.posts
						.slice()
						.sort(
							(a, b) =>
								new Date(b.postedAt).getTime() -
								new Date(a.postedAt).getTime()
						)}
					ItemSeparatorComponent={Divider}
					renderItem={PostContainer}
					keyExtractor={(item) => item.postId}
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
