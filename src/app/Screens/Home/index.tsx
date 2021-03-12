import React, { useEffect, useState } from "react";
import {
	RefreshControl,
	FlatList,
	StatusBar,
	ToastAndroid,
} from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { Post as PostType } from "../../types";
import mapPosts from "../../utils/mapPosts";
import { PostContainer } from "../../Components/PostContainer";

const Home = () => {
	const { colors, dark } = useTheme();
	const [loading, setLoading] = useState(true);

	const [posts, setPosts] = useState<Array<PostType> | null>(null);

	const fetchPosts = async () => {
		try {
			const postsCollection = firestore().collection("posts");
			const allPosts = await postsCollection.get();

			setPosts(mapPosts(allPosts));
		} catch (err) {
			console.error(err);
			ToastAndroid.show("Error retrieving posts", ToastAndroid.LONG);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	return (
		<>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={dark ? "light-content" : "dark-content"}
				animated
			/>
			{loading && <Text>Loading</Text>}
			{!loading && posts && (
				<FlatList
					data={posts.sort(
						(a, b) => b.postedAt.getTime() - a.postedAt.getTime()
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
		</>
	);
};

export default Home;
