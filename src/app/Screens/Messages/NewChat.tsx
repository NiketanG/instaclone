import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	StatusBar,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import { Appbar, Divider, Text, useTheme } from "react-native-paper";
import { useQuery } from "react-query";
import { getChatsForUser, getUser } from "../../../api";

import { ChatItem, FollowingFull, UserMin } from "../../types";
import { MessageStackNavigationParams } from "../../types/navigation/MessagesStack";
import { AppContext } from "../../utils/appContext";

import NewChatItem from "./NewChatItem";

type Props = {
	route: RouteProp<MessageStackNavigationParams, "ChatList">;
	navigation: StackNavigationProp<MessageStackNavigationParams, "ChatList">;
};

export const NewChat: React.FC<Props> = ({ navigation }) => {
	const { colors, dark } = useTheme();
	const { height } = useWindowDimensions();

	const [searchTerm, setSearchTerm] = useState("");
	const {
		data: messageList,
		isLoading,
		refetch: refetchChats,
	} = useQuery(`chatList`, () => getChatsForUser());

	const { user: currentUser } = useContext(AppContext);
	const { data, refetch: refetchCurrentUser } = useQuery(
		`userInfo_${currentUser?.username}`,
		() => getUser(currentUser?.username as any),
		{
			enabled: currentUser?.username !== null,
		}
	);

	const refetch = () => {
		refetchChats();
		refetchCurrentUser();
	};

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

	const [searchResults, setSearchResults] = useState<UserMin[] | null>();

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

	const goBack = () => navigation.goBack();

	const openMessage = (user: UserMin) => {
		navigation.navigate("Messages", user);
	};

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
			<Appbar.Header
				style={{
					backgroundColor: colors.background,
				}}
			>
				<Appbar.BackAction onPress={goBack} />
				<Appbar.Content title="New Message" />
			</Appbar.Header>

			{isLoading && (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<ActivityIndicator color={colors.onBackground} />
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
								color: colors.onBackground,
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
				data={searchResults ? searchResults : chatList.slice()}
				ItemSeparatorComponent={Divider}
				renderItem={({ item }) => (
					<NewChatItem item={item} openMessage={openMessage} />
				)}
				keyExtractor={(item) => item.username}
				bouncesZoom
				bounces
				style={{
					backgroundColor: colors.background,
				}}
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={refetch}
					/>
				}
			/>
		</View>
	);
};

export default NewChat;
