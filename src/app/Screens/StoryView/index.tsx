import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Image,
	Keyboard,
	ScrollView,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useMutation, useQuery } from "react-query";
import {
	deleteStory,
	getViewsForStory,
	newMessage,
	setStoryViewed,
} from "../../../api";
import { UserAvatar } from "../../Components/UserAvatar";
import { MessageNoUsers } from "../../types";
import {
	ViewStoryNavigationProp,
	ViewStoryRouteProp,
} from "../../types/navigation/RootStack";
import { definitions } from "../../types/supabase";
import { AppContext } from "../../utils/appContext";
import { StoryDimensions } from "../../utils/Constants";
import { queryClient } from "../../utils/queryClient";
import { getTimeDistance } from "../../utils/utils";

type StoryViewProps = {
	route: ViewStoryRouteProp;
	navigation: ViewStoryNavigationProp;
};
const StoryView: React.FC<StoryViewProps> = ({ navigation, route }) => {
	const [imageIndex, setImageIndex] = useState(0);

	const { width, height } = useWindowDimensions();
	const scrollView = useRef<ScrollView>(null);

	const { user: currUser } = useContext(AppContext);

	const stories = route.params.storyList;

	const [currentStory, setCurrentStory] = useState<
		definitions["stories"] | null
	>(null);

	useEffect(() => {
		if (route.params.user && route.params.storyList) {
			const users = Object.keys(route.params.storyList);
			const storyIndex = users.indexOf(route.params.user);
			scrollView.current?.scrollTo({
				x: (storyIndex === -1 ? 0 : storyIndex) * width,
				animated: false,
			});
			const currIndex =
				route.params.storyList[route.params.user].stories[imageIndex];
			setCurrentStory({
				...currIndex,
				user: route.params.user,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [route.params.user, route.params.storyList]);

	const onScroll = () => {
		setImageIndex(0);
	};

	const previousStory = (storyUser: string) => {
		setImageIndex(Math.max(imageIndex - 1, 0));
		if (!stories || !currUser) return null;

		const currIndex = stories[storyUser].stories[imageIndex - 1];
		setCurrentStory({
			...currIndex,
			user: storyUser,
		});
	};

	const nextStory = (storyUser: string) => {
		setImageIndex(imageIndex + 1);
		if (!stories || !currUser) return null;

		const currIndex = stories[storyUser].stories[imageIndex + 1];
		setCurrentStory({
			...currIndex,
			user: storyUser,
		});
	};

	const { data } = useQuery(
		`storyViews_${currentStory?.id}`,
		() => getViewsForStory(currentStory?.id),
		{ enabled: currentStory?.id !== null }
	);
	const newStory = () => {
		navigation.navigate("NewStory" as any);
	};

	const deleteOwnStory = async () => {
		if (currentStory) {
			navigation.navigate("Root");
			ToastAndroid.show("Story deleted", ToastAndroid.LONG);
			await deleteStory(currentStory.id);
			queryClient.invalidateQueries(`feedStories`);
			if (currUser)
				queryClient.invalidateQueries(`userInfo_${currUser.username}`);
		}
	};

	const [storyReplyText, setStoryReplyText] = useState("");

	const openShareModal = () => {
		navigation.navigate("PostShareMenu", {
			type: "STORY",
			storyId: currentStory?.id,
		});
	};

	const sendReply = () => {
		if (storyReplyText.length === 0 || !currentStory) return;
		newMessageMutation.mutate({
			message_type: "STORYREPLY",
			text: storyReplyText,
			receiver: currentStory.user,
			storyId: currentStory.id,
		});
		ToastAndroid.show(
			`Reply sent to ${currentStory.user}`,
			ToastAndroid.LONG
		);
	};

	const [replyInputFocused, setReplyInputFocused] = useState(false);

	const storyReplyRef = useRef<TextInput>(null);

	const focusStoryReply = () => {
		setReplyInputFocused(true);
		storyReplyRef.current?.focus();
	};

	const hideStoryReply = () => {
		setReplyInputFocused(false);
		storyReplyRef.current?.blur();
	};
	useEffect(() => {
		const subscriber = Keyboard.addListener(
			"keyboardDidHide",
			hideStoryReply
		);
		return () => {
			subscriber.remove();
		};
	}, []);

	const newMessageMutation = useMutation<
		definitions["messages"] | null,
		unknown,
		Pick<
			definitions["messages"],
			| "imageUrl"
			| "message_type"
			| "text"
			| "receiver"
			| "storyId"
			| "postId"
		>
	>((msg) => newMessage(msg), {
		onMutate: async (msg) => {
			if (!currentStory) return;
			await queryClient.cancelQueries(
				`messagesByUser_${currentStory.user}`
			);
			const previousMessages = queryClient.getQueryData<
				MessageNoUsers[] | null | undefined
			>(`messagesByUser_${currentStory.user}`);

			if (!currUser) return { previousMessages };

			if (previousMessages) {
				queryClient.setQueryData<MessageNoUsers[]>(
					`messagesByUser_${currentStory.user}`,
					[
						...previousMessages,
						{
							messageId: Math.random(),
							message_type: msg.message_type,
							received_at: new Date().toISOString(),
							receiver: msg.receiver,
							sender: currUser.username,
							imageUrl: msg.imageUrl,
							text: msg.text,
						},
					]
				);
			}
			return { previousMessages };
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(`chatList`);
			if (!currentStory) return;
			queryClient.invalidateQueries(
				`messagesByUser_${currentStory.user}`
			);
		},
	});

	const viewProfile = (user: string) => {
		if (stories && stories[user].user) {
			navigation.navigate("Root" as any, {
				screen: "Tabs",
				params: {
					screen: "Home",
					params: {
						screen: "Feed",
						params: {
							screen: "Profile",
							params: stories[user].user,
						},
					},
				},
			});
		}
	};

	const onStoryViewed = (storyId: number) => {
		setStoryViewed(storyId);
	};

	const { colors } = useTheme();

	const openSheet = () => {
		if (!currentStory) {
			return;
		}
		navigation.navigate("StorySheet", {
			story: currentStory,
			views: data ?? [],
		});
	};

	return (
		<>
			<ScrollView
				horizontal
				ref={scrollView}
				onScroll={onScroll}
				scrollEventThrottle={16}
				style={{
					flex: 1,
					flexDirection: "row",
				}}
				pagingEnabled
				showsHorizontalScrollIndicator={false}
			>
				{stories &&
					Object.keys(stories).map((storyUser) => (
						<View
							key={storyUser}
							style={{
								display: "flex",
								flex: 1,
								overflow: "hidden",
								flexDirection: "column",
							}}
						>
							<View>
								<View
									style={{
										position: "absolute",
										zIndex: 10,
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										width,
										height: 72,
										paddingVertical: 16,
										backgroundColor: "rgba(0,0,0,0.1)",
										paddingHorizontal: 16,
									}}
								>
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<View
											style={{
												marginLeft: 12,
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<UserAvatar
												profilePicture={
													stories[storyUser].user
														.profilePic
												}
												size={32}
												onPress={() =>
													viewProfile(
														stories[storyUser].user
															.username
													)
												}
											/>
											<Text
												onPress={() =>
													viewProfile(
														stories[storyUser].user
															.username
													)
												}
												style={{
													fontSize: 18,
													marginLeft: 12,
													textShadowColor: "black",
													textShadowRadius: 1,
													textShadowOffset: {
														height: 1,
														width: 1,
													},
													marginTop: -4,
													fontWeight: "bold",
													color: "white",
												}}
											>
												{currUser?.username ===
												stories[storyUser].user.username
													? "Your Story"
													: stories[storyUser].user
															.username}
											</Text>

											<Text
												style={{
													color: "white",
													opacity: 0.7,
													textShadowColor: "black",
													textShadowRadius: 1,
													textShadowOffset: {
														height: 1,
														width: 1,
													},
													fontSize: 14,
													marginLeft: 8,
												}}
											>
												{stories[storyUser].stories[
													imageIndex
												].postedAt !== undefined &&
													getTimeDistance(
														stories[storyUser]
															.stories[imageIndex]
															.postedAt
													)}
											</Text>
										</View>
									</View>
									{currUser?.username ===
										stories[storyUser].user.username && (
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Icon
												name="trash"
												size={16}
												onPress={deleteOwnStory}
												style={{
													marginRight: 12,
													padding: 6,
												}}
												color="white"
											/>
											<Icon
												name="add"
												size={24}
												onPress={newStory}
												color="white"
											/>
										</View>
									)}
								</View>

								<Image
									source={{
										uri: stories[storyUser].stories[
											imageIndex
										].imageUrl,
									}}
									onLoadEnd={() => {
										if (
											currUser &&
											storyUser !== currUser?.username
										)
											onStoryViewed(
												stories[storyUser].stories[
													imageIndex
												].id
											);
									}}
									width={StoryDimensions.width}
									height={StoryDimensions.height}
									style={{
										backgroundColor: "gray",
										borderRadius: 12,
										width,
										height:
											(StoryDimensions.height * width) /
											StoryDimensions.width,
									}}
								/>

								{imageIndex !== 0 && (
									<TouchableOpacity
										onPress={() =>
											previousStory(
												stories[storyUser].user.username
											)
										}
										style={{
											height: height,
											width: width / 2,
											position: "absolute",
											top: 0,
											left: 0,
										}}
									>
										<Icon
											onPress={() =>
												previousStory(
													stories[storyUser].user
														.username
												)
											}
											name="chevron-back"
											size={24}
											color="white"
											style={{
												position: "absolute",
												top: height / 2,
												left: 16,
												zIndex: 10,
												backgroundColor: "black",
												padding: 4,
												height: 32,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												borderRadius: 16,
											}}
										/>
									</TouchableOpacity>
								)}
								{imageIndex !==
									stories[storyUser].stories.length - 1 && (
									<TouchableOpacity
										onPress={() =>
											nextStory(
												stories[storyUser].user.username
											)
										}
										style={{
											height: height,
											width: width / 2,
											position: "absolute",
											top: 0,
											right: 0,
										}}
									>
										<Icon
											onPress={() =>
												nextStory(
													stories[storyUser].user
														.username
												)
											}
											name="chevron-forward"
											size={24}
											color="white"
											style={{
												position: "absolute",
												top: height / 2,
												right: 16,
												zIndex: 10,
												backgroundColor: "black",
												padding: 4,
												height: 32,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												borderRadius: 16,
											}}
										/>
									</TouchableOpacity>
								)}
							</View>
							{currUser?.username ===
							stories[storyUser].user.username ? (
								<Text
									onPress={openSheet}
									style={{
										color: "white",
										fontWeight: "bold",
										fontSize: 16,
										position: "absolute",
										bottom: 0,
										paddingVertical: 16,
										width: width,
										paddingHorizontal: 16,
										textShadowColor: "black",
										textShadowRadius: 1,
										textShadowOffset: {
											height: 1,
											width: 1,
										},
									}}
								>
									{data
										? `${data?.length} View${
												data.length === 1 ? "" : "s"
										  }`
										: ""}
								</Text>
							) : (
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										position: "absolute",
										width: width - 24,
										marginHorizontal: 12,
										bottom: 16,
										alignItems: "center",
									}}
								>
									<TouchableOpacity
										style={{
											flex: 1,
										}}
										onPress={focusStoryReply}
									>
										<TextInput
											onFocus={() =>
												setReplyInputFocused(true)
											}
											onBlur={() =>
												setReplyInputFocused(false)
											}
											ref={storyReplyRef}
											value={storyReplyText}
											onChangeText={setStoryReplyText}
											returnKeyType="send"
											placeholder="Send Message"
											placeholderTextColor={"white"}
											style={{
												backgroundColor:
													"rgba(0,0,0,0.11)",
												color: "white",
												borderColor: "white",
												borderWidth: 1,
												paddingHorizontal: 16,
												borderRadius: 24,
												textShadowColor: "black",
												textShadowRadius: 1,
												textShadowOffset: {
													height: 1,
													width: 1,
												},
												height: 48,
											}}
											onSubmitEditing={sendReply}
										/>
									</TouchableOpacity>
									{!replyInputFocused && (
										<Icon.Button
											style={{
												marginLeft: 8,
											}}
											onPress={openShareModal}
											color={colors.onBackground}
											backgroundColor="transparent"
											name={"paper-plane-outline"}
											size={22}
										/>
									)}
								</View>
							)}
						</View>
					))}
			</ScrollView>
		</>
	);
};

export default StoryView;
