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
import { Follower } from "../../store/FollowersStore";
import { MessageStackNavigationParams } from "../../types/navigation";
import { AppContext } from "../../utils/appContext";
import useChatList, { ChatList } from "../../utils/useChatList";
import useUser from "../../utils/useUser";
import NewChatItem, { NewChatItemType } from "./NewChatItem";

type Props = {
	route: RouteProp<MessageStackNavigationParams, "ChatList">;
	navigation: StackNavigationProp<MessageStackNavigationParams, "ChatList">;
};

export const NewChat: React.FC<Props> = ({ navigation }) => {
	const { colors, dark } = useTheme();
	const { height } = useWindowDimensions();
	const { messageList, loading, fetchMessageList } = useChatList();
	const [searchTerm, setSearchTerm] = useState("");

	const { user: currentUser } = useContext(AppContext);
	const { following } = useUser(currentUser?.username);

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
	>();

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

	const goBack = () => navigation.goBack();

	const openMessage = (username: string) => {
		navigation.navigate("Messages", {
			username,
		});
	};

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
						refreshing={loading}
						onRefresh={fetchMessageList}
					/>
				}
			/>
		</View>
	);
};

export default NewChat;
