import React, { useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StatusBar,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import { useQuery } from "react-query";
import { getChatsForUser, getUser } from "../../../api";
import NewChatItem from "../../Screens/Messages/NewChatItem";

import { ChatItem, FollowingFull, UserMin } from "../../types";
import { AppContext } from "../../utils/appContext";

type ModalProps = {
	closeModal: () => void;
	sendMessage: (user: UserMin) => void;
};

const ShareModal: React.FC<ModalProps> = ({ sendMessage, closeModal }) => {
	const { colors } = useTheme();
	const { height } = useWindowDimensions();
	const { data: messageList, isLoading } = useQuery(`chatList`, () =>
		getChatsForUser()
	);
	const [searchTerm, setSearchTerm] = useState("");

	const { user: currentUser } = useContext(AppContext);
	const { data } = useQuery(
		`userInfo_${currentUser?.username}`,
		() => getUser(currentUser?.username as any),
		{
			enabled: currentUser?.username !== null,
		}
	);

	const [chatList, setChatList] = useState<UserMin[]>([]);

	const getUsersList = (
		chatsList: ChatItem[],
		followingList: FollowingFull[]
	) => {
		const tempChatsList = chatsList.map((item) => item.user);
		const tempFollowingList = followingList.map((item) => item.following);
		const chatListData = [...tempChatsList, ...tempFollowingList];
		return [
			...new Map(
				chatListData.map((item) => [item.username, item])
			).values(),
		];
	};

	const [searchResults, setSearchResults] = useState<UserMin[] | null>(null);

	useEffect(() => {
		if (searchTerm.length > 0 && messageList) {
			setSearchResults(
				messageList
					.filter(
						(item) =>
							item.user.username.includes(
								searchTerm.toLowerCase()
							) ||
							item.user.name.includes(searchTerm.toLowerCase())
					)
					.map((item) => item.user)
			);
		} else {
			setSearchResults(null);
		}
	}, [messageList, searchTerm]);

	useEffect(() => {
		if (messageList && data?.following)
			setChatList(getUsersList(messageList, data.following));
	}, [messageList, data?.following]);

	useEffect(() => {
		if (searchTerm.length > 0 && messageList) {
			setSearchResults(
				messageList
					.filter(
						(item) =>
							item.user.username.includes(
								searchTerm.toLowerCase()
							) ||
							item.user.name.includes(searchTerm.toLowerCase())
					)
					.map((item) => item.user)
			);
		} else {
			setSearchResults(null);
		}
	}, [messageList, searchTerm]);

	const sendNewMessage = async (user: UserMin) => {
		sendMessage(user);
		closeModal();
	};

	return (
		<View
			style={{
				height: height,
				zIndex: 10,
				elevation: 10,
				backgroundColor: colors.surface,
				paddingVertical: 16,
				justifyContent: "center",
			}}
		>
			{isLoading && (
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
					<NewChatItem item={item} openMessage={sendNewMessage} />
				)}
				keyExtractor={(item) => item.username}
				bouncesZoom
				bounces
			/>
		</View>
	);
};

export default ShareModal;
