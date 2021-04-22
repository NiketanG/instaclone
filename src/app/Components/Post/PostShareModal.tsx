import React, { useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StatusBar,
	TextInput,
	ToastAndroid,
	useWindowDimensions,
	View,
} from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import NewChatItem, {
	NewChatItemType,
} from "../../Screens/Messages/NewChatItem";
import { Follower } from "../../store/FollowersStore";
import MessagesStore, { Message } from "../../store/MessagesStore";
import { AppContext } from "../../utils/appContext";
import { newMessageInDb } from "../../utils/supabaseUtils";
import useChatList, { ChatList } from "../../utils/useChatList";
import useUser from "../../utils/useUser";

type ModalProps = {
	closeModal: () => void;
	postId: number;
};

const PostShareModal: React.FC<ModalProps> = ({ postId, closeModal }) => {
	const { colors } = useTheme();
	const { width, height } = useWindowDimensions();
	const { messageList, loading } = useChatList();
	const [searchTerm, setSearchTerm] = useState("");

	const { username: currentUsername } = useContext(AppContext);
	const { following } = useUser(currentUsername);

	const [chatList, setChatList] = useState<NewChatItemType[]>([]);

	const getUsersList = (chatsList: ChatList[], followingList: Follower[]) => {
		const followingListData = followingList.map((user) => ({
			username: user.following,
		}));

		const chatListData = [...chatsList, ...followingListData];
		return [
			...new Map(
				chatListData.map((item) => [item.username, item])
			).values(),
		];
	};

	const [searchResults, setSearchResults] = useState<
		NewChatItemType[] | null
	>(null);

	useEffect(() => {
		if (searchTerm.length > 0) {
			setSearchResults(
				messageList.filter((item) =>
					item.username.includes(searchTerm.toLowerCase())
				)
			);
		} else {
			setSearchResults(null);
		}
	}, [messageList, searchTerm]);

	useEffect(() => {
		if (messageList && following)
			setChatList(getUsersList(messageList, following));
	}, [messageList, following]);

	useEffect(() => {
		if (searchTerm.length > 0) {
			setSearchResults(
				messageList.filter((item) =>
					item.username.includes(searchTerm.toLowerCase())
				)
			);
		} else {
			setSearchResults(null);
		}
	}, [messageList, searchTerm]);

	const newMessage = async (username: string) => {
		const messageToSend = {
			imageUrl: undefined,
			message_type: "POST",
			postId: postId,
			receiver: username,
			text: undefined,
		};
		const newMessageData = await newMessageInDb(messageToSend);
		if (newMessageData) {
			MessagesStore.addMessage(newMessageData);
			ToastAndroid.show("Post sent", ToastAndroid.LONG);
		}
		closeModal();
	};

	return (
		<View
			style={{
				height: height / 1.5,
				zIndex: 2,
				elevation: 2,
				backgroundColor: "#1f1f1f",
				paddingVertical: 16,
				justifyContent: "center",
			}}
		>
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

			<FlatList
				ListHeaderComponent={
					<>
						<TextInput
							placeholder="Search"
							placeholderTextColor={"gray"}
							onChangeText={(text) => setSearchTerm(text)}
							style={{
								flex: 1,
								marginHorizontal: 16,
								marginVertical: 16,
								height: 40,
								backgroundColor: "#3a3a3a",
								borderRadius: 6,
								paddingHorizontal: 16,
								color: colors.text,
							}}
						/>
						<Divider />
						<Text
							style={{
								marginHorizontal: 16,
								marginTop: 16,
							}}
						>
							Suggested
						</Text>
					</>
				}
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
				data={searchResults ? searchResults : chatList}
				ItemSeparatorComponent={Divider}
				renderItem={({ item }) => (
					<NewChatItem item={item} openMessage={newMessage} />
				)}
				keyExtractor={(item) => item.username}
				bouncesZoom
				bounces
			/>
		</View>
	);
};

export default PostShareModal;
