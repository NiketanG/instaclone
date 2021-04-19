import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import {
	Image,
	RefreshControl,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
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
import Icon from "react-native-vector-icons/Ionicons";
import { UserAvatar } from "../../Components/UserAvatar";
import {
	ExploreStackNavigationParams,
	ProfileStackParams,
} from "../../types/navigation";
import { AppContext } from "../../utils/authContext";
import useUser from "../../utils/useUser";

type Props = {
	route: RouteProp<ExploreStackNavigationParams, "Profile">;
	navigation: StackNavigationProp<ProfileStackParams, "ProfilePage">;
};

const Profile: React.FC<Props> = observer(({ navigation, route }) => {
	const { width, height } = useWindowDimensions();

	const imageMargin = 2;
	const imageWidth = (width - 0) / 3 - imageMargin * 2;

	const { colors, dark } = useTheme();

	const [isCurrentUser, setIsCurrentUser] = useState(false);

	const { username: savedUsername } = useContext(AppContext);

	const {
		user,
		posts,
		loading,
		followers,
		following,
		isFollowing,
		fetchUser,
		followUser,
		unfollowUser,
	} = useUser(route.params.username || savedUsername);

	const goBack = () => {
		if (route.params.goBack) {
			route.params.goBack();
		} else {
			navigation.goBack();
		}
	};

	useEffect(() => {
		if (
			savedUsername &&
			(route.params.isCurrentUser ||
				route.params.username === savedUsername)
		) {
			setIsCurrentUser(true);
		}
	}, [savedUsername, route.params]);

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
							onPress={goBack}
						/>
					)}
					{user?.username && (
						<Title
							style={{
								color: colors.text,
							}}
						>
							{user.username}
						</Title>
					)}
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
					user ? (
						<RefreshControl
							refreshing={loading}
							onRefresh={() => fetchUser(user.username)}
						/>
					) : undefined
				}
				contentContainerStyle={{
					display: "flex",
					flexDirection: "column",
					flexGrow: 1,
				}}
			>
				<View style={styles.container}>
					<View style={styles.userContainer}>
						<UserAvatar
							size={96}
							profilePicture={user?.profilePic}
						/>
						<View style={styles.statsContainer}>
							<View style={styles.textContainer}>
								<Headline style={styles.statNumber}>
									{posts?.length || 0}
								</Headline>
								<Subheading style={styles.statTitle}>
									Posts
								</Subheading>
							</View>
							<TouchableHighlight
								onPress={() => {
									navigation.navigate("Followers", {
										isCurrentUser,
										username: user?.username,
										profilePic: undefined,
										followers: followers || [],
									});
								}}
							>
								<View style={styles.textContainer}>
									<Headline style={styles.statNumber}>
										{followers?.length}
									</Headline>
									<Subheading style={styles.statTitle}>
										Followers
									</Subheading>
								</View>
							</TouchableHighlight>
							<TouchableHighlight
								onPress={() => {
									navigation.navigate("Following", {
										isCurrentUser,
										username: user?.username,
										profilePic: undefined,
										following: following || [],
									});
								}}
							>
								<View style={styles.textContainer}>
									<Headline style={styles.statNumber}>
										{following?.length}
									</Headline>
									<Subheading style={styles.statTitle}>
										Following
									</Subheading>
								</View>
							</TouchableHighlight>
						</View>
					</View>
					<View style={styles.userInfo}>
						<Subheading style={{}}>{user?.name}</Subheading>
						<Text
							style={{
								fontSize: 14,
								lineHeight: 22,
								color: "rgba(255,255,255,0.6)",
							}}
						>
							{user?.bio}
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
							{!isFollowing ? (
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
											if (user)
												navigation.navigate("Posts", {
													goBack: navigation.goBack,
													user: {
														username:
															user?.username,
														profilePic:
															user?.profilePic,
													},
													postId: post.postId,
													postList: posts,
													rootNavigation: navigation,
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
});

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
