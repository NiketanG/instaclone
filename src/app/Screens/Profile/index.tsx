import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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
import { useMutation, useQuery } from "react-query";
import { followUser, getUser, unfollowUser } from "../../../api";
import { UserAvatar } from "../../Components/UserAvatar";
import { StoryListType, UserFull } from "../../types";
import { ProfileStackParams } from "../../types/navigation/ProfileStack";
import { definitions } from "../../types/supabase";
import { AppContext } from "../../utils/appContext";
import { queryClient } from "../../utils/queryClient";

type Props = {
	route: RouteProp<ProfileStackParams, "Profile">;
	navigation: StackNavigationProp<ProfileStackParams, "Profile">;
};

const Profile: React.FC<Props> = ({ navigation, route }) => {
	const { width, height } = useWindowDimensions();

	const imageMargin = 2;
	const imageWidth = (width - 0) / 3 - imageMargin * 2;

	const { colors, dark } = useTheme();

	const [isCurrentUser, setIsCurrentUser] = useState(false);

	const { user: currentUser } = useContext(AppContext);

	const goBack = () => navigation.goBack();

	useEffect(() => {
		if (
			currentUser?.username &&
			route.params.username === currentUser?.username
		) {
			setIsCurrentUser(true);
		}
	}, [currentUser, route.params]);

	const { data, isLoading, refetch } = useQuery(
		`userInfo_${route.params.username}`,
		() => getUser(route.params.username as any),
		{
			enabled: route.params?.username !== null,
		}
	);

	const openMessage = () => {
		if (route.params.username)
			navigation.navigate("Messages" as any, {
				screen: "Messages",
				params: {
					username: route.params.username,
					profilePic: data?.profilePic,
					name: data?.name,
				},
			});
	};

	const onMutate = async (username: string) => {
		await queryClient.cancelQueries(`userInfo_${route.params.username}`);

		const userData = queryClient.getQueryData<UserFull | null | undefined>(
			`userInfo_${route.params.username}`
		);

		if (!currentUser)
			return {
				userData,
			};

		if (userData) {
			const followingIndex = userData.followers.findIndex(
				(item) => item.follower.username === currentUser.username
			);
			let followers = userData.followers;

			if (followingIndex === -1) {
				followers.push({
					id: Math.random(),
					follower: {
						name: currentUser.name,
						username: currentUser.username,
						profilePic: currentUser.profilePic,
					},
					following: username,
				});
			} else {
				followers = userData.followers.filter(
					(item) => item.follower.username !== currentUser.username
				);
			}
			queryClient.setQueryData<UserFull>(`userInfo_${username}`, {
				...userData,
				isFollowing: !userData.isFollowing,
				followers,
			});
		}

		return { userData };
	};

	const userFollowMutation = useMutation<
		definitions["followers"] | null,
		unknown,
		string
	>((username) => followUser(username), {
		onMutate,
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(`userInfo_${route.params.username}`);
			if (currentUser)
				queryClient.invalidateQueries(
					`userInfo_${currentUser.username}`
				);
		},
	});
	const userUnfollowMutation = useMutation<boolean | null, unknown, string>(
		(username) => unfollowUser(username),
		{
			onMutate,
			// Always refetch after error or success:
			onSettled: () => {
				queryClient.invalidateQueries(
					`userInfo_${route.params.username}`
				);
				if (currentUser)
					queryClient.invalidateQueries(
						`userInfo_${currentUser.username}`
					);
			},
		}
	);

	const [stories, setStories] = useState<Array<
		definitions["stories"]
	> | null>(null);

	useEffect(() => {
		if (!isLoading && data) {
			const storyTime = new Date();
			storyTime.setHours(storyTime.getHours() - 24);
			const tempStories = data.stories.filter(
				(item) =>
					new Date(item.postedAt).getTime() >= storyTime.getTime()
			);

			setStories(tempStories);
		}
	}, [data, isLoading]);

	const userFollow = () =>
		route.params.username &&
		userFollowMutation.mutate(route.params.username);

	const userUnfollow = () =>
		route.params.username &&
		userUnfollowMutation.mutate(route.params.username);

	const openStories = () => {
		if (
			!data ||
			data.stories.length === 0 ||
			!stories ||
			stories.length === 0
		)
			return;

		const storyList: {
			[key: string]: StoryListType;
		} | null = {};
		storyList[data.username] = {
			stories: stories,
			user: data,
		};
		navigation.navigate("ViewStory" as any, {
			storyList: storyList,
			user: data.username,
		});
	};

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
					{!isCurrentUser && (
						<IconButton
							icon="arrow-left"
							size={20}
							style={{
								marginRight: -4,
							}}
							onPress={goBack}
						/>
					)}
					{route.params.username && (
						<Title
							style={{
								marginTop: -4,
								marginLeft: 16,
								color: colors.onBackground,
							}}
						>
							{route.params.username}
						</Title>
					)}
				</View>
				{isCurrentUser && (
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
						refreshing={isLoading}
						onRefresh={refetch}
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
						<View
							style={{
								borderWidth: 1,
								borderColor:
									(!data || !stories || stories.length) > 0
										? "white"
										: "transparent",
								borderRadius: 56,
								padding: 6,
							}}
						>
							<UserAvatar
								size={96}
								profilePicture={data?.profilePic}
								onPress={openStories}
							/>
						</View>
						<View style={styles.statsContainer}>
							<View style={styles.textContainer}>
								<Headline style={styles.statNumber}>
									{data?.posts?.length || 0}
								</Headline>
								<Subheading style={styles.statTitle}>
									Posts
								</Subheading>
							</View>
							<TouchableHighlight
								onPress={() => {
									if (data)
										navigation.navigate("Followers", {
											username: data.username,
											followers: data.followers,
										});
								}}
							>
								<View style={styles.textContainer}>
									<Headline style={styles.statNumber}>
										{data?.followers.length}
									</Headline>
									<Subheading style={styles.statTitle}>
										Followers
									</Subheading>
								</View>
							</TouchableHighlight>
							<TouchableHighlight
								onPress={() => {
									if (data)
										navigation.navigate("Following", {
											username: data.username,
											following: data.following,
										});
								}}
							>
								<View style={styles.textContainer}>
									<Headline style={styles.statNumber}>
										{data?.following.length}
									</Headline>
									<Subheading style={styles.statTitle}>
										Following
									</Subheading>
								</View>
							</TouchableHighlight>
						</View>
					</View>
					<View style={styles.userInfo}>
						<Subheading>{data?.name}</Subheading>
						<Text
							style={{
								fontSize: 14,
								lineHeight: 22,
								color: "rgba(255,255,255,0.6)",
							}}
						>
							{data?.bio}
						</Text>
					</View>

					{isCurrentUser ? (
						<Button
							mode="outlined"
							color={colors.onBackground}
							style={{
								borderColor: colors.onBackground,
								marginTop: 16,
							}}
							compact
							uppercase={false}
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
							{!data?.isFollowing ? (
								<Button
									mode="contained"
									color={colors.primary}
									style={{
										width: width - 32,
										borderColor: colors.onBackground,
										marginTop: 16,
									}}
									onPress={userFollow}
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
											borderColor: colors.onBackground,
											marginTop: 16,
										}}
										onPress={userUnfollow}
									>
										Unfollow
									</Button>
									<Button
										mode="outlined"
										color={colors.primary}
										style={{
											width: width / 2 - 24,
											borderColor: colors.onBackground,
											marginTop: 16,
										}}
										onPress={openMessage}
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
					{isLoading && (
						<View
							style={{
								height: "100%",
								flexDirection: "column",
								justifyContent: "center",
								width: width,
								flexGrow: 1,
							}}
						>
							<ActivityIndicator color={colors.onBackground} />
						</View>
					)}

					{data?.posts &&
						(data?.posts?.length === 0 ? (
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
									color={colors.onBackground}
								/>
								<Text
									style={{
										color: colors.onBackground,
									}}
								>
									No posts yet
								</Text>
							</View>
						) : (
							data?.posts
								.sort(
									(a, b) =>
										new Date(b.postedAt).getTime() -
										new Date(a.postedAt).getTime()
								)
								.map((post) => (
									<TouchableHighlight
										key={post.postId}
										onPress={() => {
											navigation.navigate("PostsList", {
												postId: post.postId,
												postList: data.posts.map(
													(item) => ({
														...item,
														user: data,
													})
												),
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
