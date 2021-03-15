import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	ScrollView,
	useWindowDimensions,
	TouchableHighlight,
	RefreshControl,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import {
	Caption,
	IconButton,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import { Post, User } from "../../types";
import mapPosts from "../../utils/mapPosts";
import { ExploreStackNavigationParams } from "../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

type Props = {
	navigation: StackNavigationProp<ExploreStackNavigationParams, "Explore">;
};

const Explore: React.FC<Props> = ({ navigation }) => {
	const { width, height } = useWindowDimensions();
	const { colors } = useTheme();
	const imageMargin = 2;
	const imageWidth = (width - 16) / 3 - imageMargin * 2;

	const [searchTerm, setSearchTerm] = useState("");

	const usersCollection = firestore().collection("users");
	const postsCollection = firestore().collection("posts");

	const [searchResults, setSearchResults] = useState<null | User>(null);
	const [postList, setPostList] = useState<Array<Post> | null>(null);

	const fetchPosts = async () => {
		setLoading(true);
		try {
			const postRes = await postsCollection.orderBy("postedAt").get();
			if (postRes.docs.length > 0) {
				setPostList(mapPosts(postRes));
				return;
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		(async () => {
			const userRes = await usersCollection
				.where("username", "==", "nikketan")
				.get();
			if (userRes.docs.length > 0) {
				const userNikketan = userRes.docs[0];
				setSearchResults({
					bio: userNikketan.get("bio"),
					name: userNikketan.get("name"),
					username: "nikketan",
					profilePic: userNikketan.get("profilePic") as
						| string
						| undefined,
				});
				return;
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const searchUser = async (username: string) => {
		setSearchTerm(username);
		if (username.length < 2) return;

		const userExists = await usersCollection
			.where("username", "==", username.toLowerCase())
			.get();

		if (userExists.docs.length > 0) {
			const user = userExists.docs[0];
			setSearchResults({
				bio: user.get("bio"),
				name: user.get("name"),
				username: user.get("username"),
				profilePic: user.get("profilePic") as string | undefined,
			});
			return;
		} else {
			setSearchResults(null);
		}
	};

	const [searchFocused, setSearchFocused] = useState(false);
	const [loading, setLoading] = useState(false);

	return (
		<ScrollView
			style={{
				...styles.container,
				backgroundColor: colors.background,
				height: "100%",
			}}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				{searchFocused && (
					<IconButton
						icon="arrow-left"
						onPress={() => setSearchFocused(false)}
						size={20}
						style={{ marginTop: 12, marginRight: 8 }}
					/>
				)}
				<TextInput
					placeholder="Search"
					dense
					style={{
						backgroundColor: colors.surface,
						flexGrow: 1,
					}}
					mode="outlined"
					onFocus={() => setSearchFocused(true)}
					// onBlur={() => setSearchFocused(false)}
					value={searchTerm}
					onChangeText={(text) => searchUser(text)}
				/>
			</View>
			{searchFocused ? (
				<View
					style={{
						backgroundColor: colors.background,
						zIndex: 5,
						flex: 1,
						width: "100%",
						elevation: 5,
						borderBottomEndRadius: 8,
						borderBottomStartRadius: 8,
					}}
				>
					<Caption>Please enter the complete username</Caption>

					{searchResults && (
						<TouchableHighlight
							onPress={() => {
								navigation.navigate("ProfilePage", {
									username: searchResults.username,
									profilePic: searchResults.profilePic,
								});
							}}
						>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									margin: 16,
								}}
							>
								<UserAvatar
									profilePicture={searchResults.profilePic}
								/>
								<View
									style={{
										marginHorizontal: 16,
									}}
								>
									<Text
										style={{
											fontSize: 14,
											fontWeight: "bold",
										}}
									>
										{searchResults.username}
									</Text>
									<Caption>{searchResults.name}</Caption>
								</View>
							</View>
						</TouchableHighlight>
					)}
				</View>
			) : (
				<ScrollView
					contentContainerStyle={{
						...styles.grid,
					}}
					style={{
						height: height - 128,
					}}
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={fetchPosts}
						/>
					}
				>
					{postList &&
						postList.map((post) => (
							<TouchableHighlight
								key={post.postId}
								onPress={() => {
									navigation.navigate("PostDetail", {
										post,
										user: {
											username: post.username,
											profilePic: null,
										},
									});
								}}
							>
								<Image
									source={{
										uri: post.imageUrl,
									}}
									width={imageWidth}
									height={imageWidth}
									style={{
										backgroundColor: "gray",
										margin: imageMargin,
										width: imageWidth,
										height: imageWidth,
									}}
								/>
							</TouchableHighlight>
						))}
				</ScrollView>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		paddingTop: 8,
	},
	grid: {
		flex: 1,
		width: "100%",
		marginVertical: 12,
		flexDirection: "row",
		flexWrap: "wrap",
	},
});

export default Explore;
