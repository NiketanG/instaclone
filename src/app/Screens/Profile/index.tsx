import React, { useCallback, useContext, useEffect, useState } from "react";

import {
	Image,
	RefreshControl,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	ToastAndroid,
	useWindowDimensions,
	View,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import {
	ActivityIndicator,
	Button,
	Divider,
	Headline,
	IconButton,
	Subheading,
	Title,
	useTheme,
} from "react-native-paper";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation";
import { AppContext } from "../../utils/authContext";
import firestore from "@react-native-firebase/firestore";

import Icon from "react-native-vector-icons/Ionicons";
import { UserAvatar } from "../../Components/UserAvatar";
import PostsStore, { Post } from "../../store/PostsStore";
import UsersStore from "../../store/UsersStore";
import FollowersStore from "../../store/FollowersStore";

type Props = {
	route: RouteProp<ProfileStackParams, "ProfilePage">;
	navigation: StackNavigationProp<ProfileStackParams, "ProfilePage">;
};

const Profile: React.FC<Props> = ({ navigation, route }) => {
	const { width, height } = useWindowDimensions();

	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");

	const imageMargin = 2;
	const imageWidth = (width - 0) / 3 - imageMargin * 2;

	const { colors, dark } = useTheme();

	const [isCurrentUser, setIsCurrentUser] = useState(false);
	const [profilePic, setProfilePic] = useState<string | null>(null);

	const [posts, setPosts] = useState<Array<Post> | null>(null);

	const [followers, setFollowers] = useState(0);
	const [following, setFollowing] = useState(0);

	const [loading, setLoading] = useState(true);

	const { username: savedUsername } = useContext(AppContext);

	const [followingUser, setFollowingUser] = useState(false);

	const followersCollection = firestore().collection("followers");

	const followUser = async () => {
		if (!route.params.username) return;
		if (isCurrentUser) return;
		setFollowingUser(true);
		setFollowers(followers + 1);
		const followingRes = await followersCollection
			.where("following", "==", route.params.username)
			.where("follower", "==", savedUsername)
			.get();

		if (followingRes.docs.length === 0) {
			await followersCollection.add({
				following: route.params.username,
				follower: savedUsername,
			});
		}
	};

	const unfollowUser = async () => {
		if (isCurrentUser) return;
		if (!route.params.username) return;

		setFollowingUser(false);
		setFollowers(followers - 1);

		const followingRes = await followersCollection
			.where("following", "==", route.params.username)
			.where("follower", "==", savedUsername)
			.get();

		if (followingRes.docs.length === 0) {
			setFollowingUser(false);
		} else {
			const follower = followingRes.docs[0];
			await followersCollection.doc(follower.id).delete();
		}
	};

	const checkFollowing = useCallback(
		async (userToSearch: string) => {
			if (!savedUsername) return;
			const followingRes = await followersCollection
				.where("following", "==", userToSearch)
				.where("follower", "==", savedUsername)
				.get();

			if (followingRes.docs.length === 0) {
				setFollowingUser(false);
			} else {
				setFollowingUser(true);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[savedUsername]
	);

	const fetchUser = useCallback(
		async (userToSearch: string) => {
			if (!userToSearch) return;
			const user = await UsersStore.getUser(userToSearch);
			if (!user) {
				ToastAndroid.show("User not found", ToastAndroid.LONG);
				navigation.goBack();
				return;
			} else {
				setBio(user.bio);
				setProfilePic(user.profilePic);
				setName(user.name);
			}

			const followersList = await FollowersStore.getFollowers(
				userToSearch
			);
			if (followersList) setFollowers(followersList.length);

			const followingList = await FollowersStore.getFollowing(
				userToSearch
			);

			if (followingList) setFollowing(followingList.length);
		},
		[navigation]
	);

	useEffect(() => {
		if (
			savedUsername &&
			(route.params.isCurrentUser ||
				route.params.username === savedUsername)
		) {
			setUsername(savedUsername);
			setIsCurrentUser(true);
			fetchUser(savedUsername);
		}
		if (route.params.username) {
			setUsername(route.params.username);
			fetchUser(route.params.username);
			checkFollowing(route.params.username);
		}
		if (route.params.profilePic) setProfilePic(route.params.profilePic);
	}, [savedUsername, route.params, fetchUser, checkFollowing]);

	const fetchPosts = useCallback(async () => {
		if (!username || username.length === 0) return;

		try {
			setPosts(await PostsStore.fetchPostsByUser(username));
		} catch (err) {
			console.error(err);
			ToastAndroid.show("Error retrieving posts", ToastAndroid.LONG);
		} finally {
			setLoading(false);
		}
	}, [username]);

	useEffect(() => {
		if (username && username.length > 0) {
			fetchPosts();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [PostsStore.posts, fetchPosts, username]);

	return (
		<View
			style={{
				backgroundColor: colors.background,
				display: "flex",
				height,
			}}
		>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={dark ? "light-content" : "dark-content"}
				animated
			/>
			<View
				style={{
					display: "flex",
					marginTop: 8,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					marginHorizontal: 8,
				}}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					{route.params.username && (
						<IconButton
							icon="arrow-left"
							size={20}
							style={{
								marginRight: 16,
							}}
							onPress={() => {
								navigation.goBack();
							}}
						/>
					)}
					<Title
						style={{
							color: colors.text,
						}}
					>
						{username}
					</Title>
				</View>
				{!route.params.username && (
					<IconButton
						icon="cog-outline"
						size={20}
						onPress={() => {
							navigation.navigate("Settings");
						}}
					/>
				)}
			</View>
			<ScrollView
				bouncesZoom
				bounces
				removeClippedSubviews
				snapToAlignment={"start"}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={fetchPosts}
					/>
				}
				contentContainerStyle={{
					display: "flex",
					flexDirection: "column",
					flexGrow: 1,
				}}
			>
				<View style={styles.container}>
					<View style={styles.userContainer}>
						<UserAvatar size={96} profilePicture={profilePic} />
						<View style={styles.statsContainer}>
							<View style={styles.textContainer}>
								<Headline style={styles.statNumber}>
									{posts?.length || 0}
								</Headline>
								<Subheading style={styles.statTitle}>
									Posts
								</Subheading>
							</View>
							<View style={styles.textContainer}>
								<Headline style={styles.statNumber}>
									{followers}
								</Headline>
								<Subheading style={styles.statTitle}>
									Followers
								</Subheading>
							</View>
							<View style={styles.textContainer}>
								<Headline style={styles.statNumber}>
									{following}
								</Headline>
								<Subheading style={styles.statTitle}>
									Following
								</Subheading>
							</View>
						</View>
					</View>
					<View style={styles.userInfo}>
						<Subheading style={{}}>{name}</Subheading>
						<Text
							style={{
								fontSize: 14,
								lineHeight: 22,
								color: "rgba(255,255,255,0.6)",
							}}
						>
							{bio}
						</Text>
					</View>

					{isCurrentUser ? (
						<Button
							mode="outlined"
							color={colors.text}
							style={{
								borderColor: colors.text,
								marginTop: 16,
							}}
							onPress={() => navigation.navigate("EditProfile")}
						>
							Edit Profile
						</Button>
					) : (
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							{!followingUser ? (
								<Button
									mode="contained"
									color={colors.primary}
									style={{
										width: width - 32,
										borderColor: colors.text,
										marginTop: 16,
									}}
									onPress={followUser}
								>
									Follow
								</Button>
							) : (
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										flex: 1,
										justifyContent: "space-between",
									}}
								>
									<Button
										mode="outlined"
										color={colors.primary}
										style={{
											width: width / 2 - 24,
											borderColor: colors.text,
											marginTop: 16,
										}}
										onPress={unfollowUser}
									>
										Unfollow
									</Button>
									<Button
										mode="outlined"
										color={colors.primary}
										style={{
											width: width / 2 - 24,
											borderColor: colors.text,
											marginTop: 16,
										}}
										onPress={() =>
											navigation.navigate("EditProfile")
										}
									>
										Message
									</Button>
								</View>
							)}
						</View>
					)}
					<Divider
						style={{
							marginTop: 16,
						}}
					/>
				</View>
				<View
					style={{
						...styles.grid,
						backgroundColor: colors.background,
						width,
						flexGrow: 1,
						display: "flex",
					}}
				>
					{loading && (
						<View
							style={{
								height: "100%",
								flexDirection: "column",
								justifyContent: "center",
								width: width,
								flexGrow: 1,
							}}
						>
							<ActivityIndicator color={colors.text} />
						</View>
					)}

					{posts &&
						(posts?.length === 0 ? (
							<View
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexGrow: 1,
								}}
							>
								<Icon
									name="camera-outline"
									size={36}
									color={colors.text}
								/>
								<Text
									style={{
										color: colors.text,
									}}
								>
									No posts yet
								</Text>
							</View>
						) : (
							posts
								.sort(
									(a, b) =>
										new Date(b.postedAt).getTime() -
										new Date(a.postedAt).getTime()
								)
								.map((post) => (
									<TouchableHighlight
										key={post.postId}
										onPress={() => {
											navigation.navigate("Posts", {
												user: {
													username,
													profilePic,
												},
												postId: post.postId,
												postList: posts,
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
								))
						))}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 8,
		marginHorizontal: 16,
	},
	userContainer: {
		marginTop: 16,
		display: "flex",
		alignItems: "center",
		flexDirection: "row",
		width: "100%",
	},
	statsContainer: {
		display: "flex",
		flexDirection: "row",
		marginLeft: 32,
		flexGrow: 1,
		justifyContent: "space-between",
	},
	textContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	statNumber: {
		fontSize: 20,
		fontWeight: "bold",
	},
	statTitle: {
		marginTop: -4,
		fontSize: 14,
	},
	userInfo: {
		marginTop: 16,
	},
	grid: {
		display: "flex",
		width: "100%",
		marginVertical: 12,
		flexDirection: "row",
		flexWrap: "wrap",
	},
});

export default Profile;
