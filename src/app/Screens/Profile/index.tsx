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
import auth from "@react-native-firebase/auth";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation";
import { AppContext } from "../../utils/authContext";
import firestore from "@react-native-firebase/firestore";

import Icon from "react-native-vector-icons/Ionicons";
import { Post } from "../../types";
import mapPosts from "../../utils/mapPosts";
type Props = {
	route: RouteProp<ProfileStackParams, "ProfilePage">;
	navigation: StackNavigationProp<ProfileStackParams, "ProfilePage">;
};

const Profile: React.FC<Props> = ({ navigation }) => {
	const { width, height } = useWindowDimensions();
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const {
		bio: savedBio,
		name: savedName,
		username: savedUsername,
		profilePic: savedProfilePic,
		setProfilePic: updateProfilePic,
		setBio: updateBio,
		setName: updateName,
		setUsername: updateUsername,
	} = useContext(AppContext);

	const imageMargin = 2;
	const imageWidth = (width - 0) / 3 - imageMargin * 2;

	const { colors, dark } = useTheme();

	const currentUser = auth().currentUser;
	const [profilePic, setProfilePic] = useState<string | null>(null);

	const [posts, setPosts] = useState<Array<Post> | null>(null);

	const [followers, setFollowers] = useState(0);
	const [following, setFollowing] = useState(0);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setUsername(savedUsername || "");
		setName(savedName || "");
		setBio(savedBio || "");
		setFollowers(0);
		setFollowing(0);
		if (savedProfilePic) setProfilePic(savedProfilePic);
	}, [savedBio, savedName, savedUsername, savedProfilePic]);

	useEffect(() => {
		(async () => {
			if (currentUser) {
				const usersCollection = firestore().collection("users");

				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const userExists = await usersCollection
					.where("email", "==", currentUser.email?.toLowerCase())
					.get();

				const currentName = userExists.docs[0].get("name")?.toString();

				const currentUserName = userExists.docs[0]
					.get("username")
					?.toString();

				const currentProfilePic = userExists.docs[0]
					.get("profilePic")
					?.toString();

				const currentBio = userExists.docs[0].get("bio")?.toString();

				if (currentName) {
					setName(currentName);
					updateName(currentName);
				}
				if (currentUserName) {
					setUsername(currentUserName);
					updateUsername(currentUserName);
				}
				if (currentProfilePic) {
					setProfilePic(currentProfilePic);
					updateProfilePic(currentProfilePic);
				}

				if (currentBio) {
					setBio(currentBio);
					updateBio(currentBio);
				}
			}
		})();
	}, [currentUser, updateBio, updateName, updateProfilePic, updateUsername]);

	const fetchPosts = useCallback(async () => {
		if (!savedUsername) return;
		try {
			const postsCollection = firestore().collection("posts");
			const allPosts = await postsCollection
				.where("username", "==", savedUsername.toLowerCase())
				.get();

			setPosts(mapPosts(allPosts));
		} catch (err) {
			console.error(err);
			ToastAndroid.show("Error retrieving posts", ToastAndroid.LONG);
		} finally {
			setLoading(false);
		}
	}, [savedUsername]);

	useEffect(() => {
		if (savedUsername) {
			fetchPosts();
		}
	}, [fetchPosts, savedUsername]);

	if (!currentUser) {
		return (
			<View>
				<Text>User not found</Text>
			</View>
		);
	}

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
					marginHorizontal: 16,
				}}
			>
				<Title
					style={{
						color: colors.text,
					}}
				>
					{username}
				</Title>
				<IconButton
					icon="cog-outline"
					size={20}
					onPress={() => {
						navigation.navigate("Settings");
					}}
				/>
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
						{profilePic && (
							<Image
								source={{
									uri: profilePic,
								}}
								width={96}
								height={96}
								style={{
									borderRadius: 48,
									width: 96,
									height: 96,
								}}
							/>
						)}
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
					<Divider />
				</View>
				<View
					style={{
						...styles.grid,
						backgroundColor: dark
							? colors.surface
							: "rgb(230,230,230)",

						flexGrow: 1,
						display: "flex",
					}}
				>
					{loading ? (
						<View
							style={{
								display: "flex",
								flex: 1,
								flexDirection: "column",
								justifyContent: "center",
								width: "100%",
								flexGrow: 1,
							}}
						>
							<ActivityIndicator color={colors.text} />
						</View>
					) : posts && posts.length > 0 ? (
						posts
							.sort(
								(a, b) =>
									b.postedAt.getTime() - a.postedAt.getTime()
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
					) : (
						<View
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexGrow: 1,
							}}
						>
							<Icon name="camera-outline" size={36} />
							<Text>No posts yet</Text>
						</View>
					)}
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
