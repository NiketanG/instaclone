import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	StatusBar,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Appbar, Caption, Divider, Text, useTheme } from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import { MessageStackNavigationParams } from "../../types/navigation";
import useChatList, { ChatList } from "../../utils/useChatList";
import useUser from "../../utils/useUser";
import { getTimeDistance } from "../../utils/utils";

type Props = {
	route: RouteProp<MessageStackNavigationParams, "ChatList">;
	navigation: StackNavigationProp<MessageStackNavigationParams, "ChatList">;
	goBack: () => void;
};

type UserItemProps = {
	item: ChatList;
	openMessage: (username: string) => void;
};

const UserListItem: React.FC<UserItemProps> = ({ item, openMessage }) => {
	const { user } = useUser(item.username);
	return (
		<TouchableOpacity
			key={item.username}
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				margin: 16,
			}}
			onPress={() => openMessage(item.username)}
		>
			<UserAvatar size={32} profilePicture={user?.profilePic} />
			<View
				style={{
					marginLeft: 16,
				}}
			>
				<Text
					style={{
						fontSize: 18,
					}}
				>
					{item.username}
				</Text>
				<Caption>
					{item.text
						? item.text
						: item.messageType === "POST"
						? "Sent a post"
						: item.messageType === "IMAGE"
						? "Sent an image"
						: "Unsupported Message"}{" "}
					- {getTimeDistance(item.lastMessageAt)}
				</Caption>
			</View>
		</TouchableOpacity>
	);
};

const MessagesList: React.FC<Props> = ({ navigation, route, goBack }) => {
	const { colors, dark } = useTheme();
	const { height } = useWindowDimensions();
	const { messageList, loading, fetchMessageList } = useChatList();
	const [searchTerm, setSearchTerm] = useState("");

	const newMessage = () => navigation.navigate("NewChat");

	const openMessage = (username: string) => {
		navigation.navigate("Messages", {
			username,
		});
	};

	const [searchResults, setSearchResults] = useState<ChatList[] | null>();

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
				<Appbar.Content title="Messages" />
				<Appbar.Action icon="plus" onPress={newMessage} />
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
				data={
					searchResults
						? searchResults
						: messageList
								.slice()
								.sort(
									(a, b) =>
										new Date(b.lastMessageAt).getTime() -
										new Date(a.lastMessageAt).getTime()
								)
				}
				ItemSeparatorComponent={Divider}
				renderItem={({ item }) => (
					<UserListItem item={item} openMessage={openMessage} />
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

export default MessagesList;
