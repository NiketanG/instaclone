import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
	BackHandler,
	DeviceEventEmitter,
	Image,
	ScrollView,
	StatusBar,
	Text,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import { IconButton, TouchableRipple, useTheme } from "react-native-paper";
import { useMutation, useQuery } from "react-query";
import {
	deleteMessage,
	getMessagesByUser,
	getStoryById,
	newMessage,
} from "../../../api";
import ImageMessage from "../../Components/Messages/ImageMessage";
import PostMessage from "../../Components/Messages/PostMessage";
import TextMessage from "../../Components/Messages/TextMessage";
import { MessageNoUsers, StoryListType } from "../../types";
import { MessageStackNavigationParams } from "../../types/navigation/MessagesStack";
import { definitions } from "../../types/supabase";
import { AppContext } from "../../utils/appContext";
import { queryClient } from "../../utils/queryClient";
import useImageUpload from "../../../hooks/useImageUpload";
import StoryMessage from "../../Components/Messages/StoryMessage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { UserAvatar } from "../../Components/UserAvatar";
type Props = {
	route: RouteProp<MessageStackNavigationParams, "Messages">;
	navigation: StackNavigationProp<MessageStackNavigationParams, "Messages">;
};

const Messages: React.FC<Props> = ({ navigation, route }) => {
	const { colors, dark } = useTheme();

	const { data, isLoading: loading } = useQuery(
		`messagesByUser_${route.params.username}`,
		() => getMessagesByUser(route.params.username)
	);
	const scrollViewRef = useRef<ScrollView>(null);

	useEffect(() => {
		if (!loading) scrollViewRef.current?.scrollToEnd();
	}, [scrollViewRef, loading]);

	const openStory = async (storyId: number | undefined) => {
		if (!storyId) return;
		const storyData = await getStoryById(storyId);

		if (!storyData) return;

		let storiesToView: {
			[key: string]: StoryListType;
		} | null = {};

		storiesToView[storyData.user.username] = {
			user: storyData.user,
			stories: [
				{
					id: storyData.id,
					imageUrl: storyData.imageUrl,
					postedAt: storyData.postedAt,
				},
			],
		};

		navigation.navigate("ViewStory" as any, {
			storyList: storiesToView,
			user: storyData.user.username,
		});
	};

	useEffect(() => {
		const handler = () => {
			scrollViewRef.current?.scrollToEnd();
		};
		const listener = DeviceEventEmitter.addListener("newMessage", handler);

		return () => {
			listener.remove();
		};
	}, []);

	const newMessageMutation = useMutation<
		definitions["messages"] | null,
		unknown,
		Pick<
			definitions["messages"],
			"imageUrl" | "message_type" | "text" | "receiver"
		>
	>((msg) => newMessage(msg), {
		onMutate: async (msg) => {
			await queryClient.cancelQueries(
				`messagesByUser_${route.params.username}`
			);
			const previousMessages = queryClient.getQueryData<
				MessageNoUsers[] | null | undefined
			>(`messagesByUser_${route.params.username}`);

			if (!currentUser) return { previousMessages };

			if (previousMessages) {
				queryClient.setQueryData<MessageNoUsers[]>(
					`messagesByUser_${route.params.username}`,
					[
						...previousMessages,
						{
							messageId: Math.random(),
							message_type: msg.message_type,
							received_at: new Date().toISOString(),
							receiver: msg.receiver,
							sender: currentUser.username,
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
			queryClient.invalidateQueries(
				`messagesByUser_${route.params.username}`
			);
			queryClient.invalidateQueries(`chatList`);
		},
	});

	const deleteMessageMutation = useMutation<boolean | null, unknown, number>(
		(messageId) => deleteMessage(messageId),
		{
			onMutate: async (messageId) => {
				await queryClient.cancelQueries(
					`messagesByUser_${route.params.username}`
				);
				const previousMessages = queryClient.getQueryData<
					MessageNoUsers[] | null | undefined
				>(`messagesByUser_${route.params.username}`);

				if (!currentUser) return { previousMessages };

				if (previousMessages) {
					queryClient.setQueryData<MessageNoUsers[]>(
						`messagesByUser_${route.params.username}`,
						previousMessages.filter(
							(item) => item.messageId !== messageId
						)
					);
				}
				return { previousMessages };
			},
			// Always refetch after error or success:
			onSettled: () => {
				queryClient.invalidateQueries(
					`messagesByUser_${route.params.username}`
				);
				queryClient.invalidateQueries(`chatList`);
			},
		}
	);

	const { user: currentUser } = useContext(AppContext);

	const { selectFromGallery } = useImageUpload();

	const addImage = async () => {
		const uploadedImage = await selectFromGallery();
		if (!uploadedImage) {
			console.error("[addImage] Error while uploading");
			return;
		}

		if (!route.params.username) return;
		newMessageMutation.mutate({
			receiver: route.params.username,
			imageUrl: uploadedImage,
			message_type: "IMAGE",
		});
		scrollViewRef.current?.scrollToEnd();
	};

	const [messageText, setMessageText] = useState("");

	const goBack = () => {
		if (selectedMessage) {
			setSelectedMessage(null);
		} else {
			navigation.goBack();
		}
	};

	const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

	const selectMessage = (username: string, messsageId: number) =>
		username === currentUser?.username && setSelectedMessage(messsageId);

	const sendMessage = () => {
		if (messageText.length === 0) return;
		setMessageText("");
		newMessageMutation.mutate({
			receiver: route.params.username,
			text: messageText,
			message_type: "TEXT",
		});
		scrollViewRef.current?.scrollToEnd();
	};

	const removeMessage = () => {
		if (selectedMessage) deleteMessageMutation.mutate(selectedMessage);
		setSelectedMessage(null);
	};

	const openProfile = () => {
		navigation.navigate("Profile", {
			username: route.params.username,
		});
	};

	const [expanded, setExpanded] = useState(false);
	const [expandedImageUrl, setExpandedImageUrl] = useState<string | null>(
		null
	);

	const { width, height } = useWindowDimensions();
	const toggleImageExpand = (imageUrl?: string) => {
		setExpanded(!expanded);
		setExpandedImageUrl(imageUrl || null);
	};

	useFocusEffect(
		React.useCallback(() => {
			const onBackPress = () => {
				if (expanded && setExpandedImageUrl) {
					setExpanded(false);
					setExpandedImageUrl(null);
					return true;
				} else if (selectedMessage) {
					setSelectedMessage(null);
					return true;
				} else {
					return false;
				}
			};

			BackHandler.addEventListener("hardwareBackPress", onBackPress);

			return () =>
				BackHandler.removeEventListener(
					"hardwareBackPress",
					onBackPress
				);
		}, [expanded, setExpandedImageUrl, selectedMessage])
	);

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
			<View
				style={{
					height: 56,
					backgroundColor: selectedMessage
						? "#009688"
						: colors.background,
					width,
					paddingHorizontal: 24,
					paddingVertical: 16,
					justifyContent: "space-between",
					display: "flex",
					flexDirection: "row",
				}}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						flexGrow: 1,
						alignItems: "center",
					}}
				>
					<MaterialCommunityIcons
						name="arrow-left"
						color="white"
						size={24}
						onPress={goBack}
						style={{
							marginRight: 12,
						}}
					/>
					{!selectedMessage && (
						<UserAvatar
							profilePicture={route.params.profilePic}
							onPress={openProfile}
						/>
					)}
					<Text
						onPress={openProfile}
						style={{
							fontSize: 18,
							marginLeft: 12,
							marginTop: -6,
							fontWeight: "bold",
							color: "white",
						}}
					>
						{selectedMessage
							? "Selected Message"
							: route.params.username}
					</Text>
				</View>

				{selectedMessage && (
					<MaterialCommunityIcons
						name="delete"
						color="white"
						size={24}
						onPress={removeMessage}
					/>
				)}
			</View>

			{expanded && expandedImageUrl && (
				<TouchableRipple
					onPress={() => {
						toggleImageExpand();
					}}
					rippleColor={"black"}
					style={{
						width,
						alignItems: "center",
						justifyContent: "center",
						elevation: 10,
						zIndex: 10,
						height,
						display: "flex",
						position: "absolute",
						backgroundColor: "rgba(0,0,0,0.75)",
					}}
				>
					<Image
						source={{
							uri: expandedImageUrl,
						}}
						style={{
							height: width - 48,
							width: width - 48,
							backgroundColor: "#3a3a3a",
							marginHorizontal: 8,
							marginVertical: 4,
							borderRadius: 8,
						}}
					/>
				</TouchableRipple>
			)}

			<ScrollView
				ref={scrollViewRef}
				style={{
					flex: 1,
				}}
			>
				{data?.map((message) => {
					if (message.message_type === "IMAGE")
						return (
							<ImageMessage
								toggleImageExpand={() => {
									toggleImageExpand(message.imageUrl);
								}}
								key={message.messageId}
								message={message}
								selectMessage={selectMessage}
							/>
						);

					if (message.message_type === "POST")
						return (
							<PostMessage
								key={message.messageId}
								message={message}
								selectMessage={selectMessage}
							/>
						);

					if (message.message_type === "TEXT")
						return (
							<TextMessage
								key={message.messageId}
								message={message}
								selectMessage={selectMessage}
							/>
						);

					if (
						(message.message_type === "STORYREPLY" ||
							message.message_type === "STORY") &&
						message.storyId
					)
						return (
							<StoryMessage
								key={message.messageId}
								message={message}
								selectMessage={selectMessage}
								openStory={() => openStory(message.storyId)}
							/>
						);
				})}
			</ScrollView>
			<View
				style={{
					maxHeight: 48,
					height: 48,
					backgroundColor: "#3a3a3a",
					marginHorizontal: 8,
					marginVertical: 8,
					borderRadius: 24,
					display: "flex",
					flexDirection: "row",
				}}
			>
				<TextInput
					value={messageText}
					placeholder="Message..."
					placeholderTextColor={"gray"}
					onChangeText={(text) => setMessageText(text)}
					style={{
						flex: 1,
						paddingLeft: 16,
						color: colors.onBackground,
					}}
					onSubmitEditing={sendMessage}
				/>
				<IconButton icon="attachment" onPress={addImage} />
				<IconButton icon="send" onPress={sendMessage} />
			</View>
		</View>
	);
};

export default Messages;
