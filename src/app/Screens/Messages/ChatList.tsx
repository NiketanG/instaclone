import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { SupabaseRealtimePayload } from "@supabase/supabase-js";
import React, { useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	DeviceEventEmitter,
	FlatList,
	RefreshControl,
	StatusBar,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Appbar, Caption, Divider, Text, useTheme } from "react-native-paper";
import { useQuery } from "react-query";
import { getChatsForUser } from "../../../api";
import { UserAvatar } from "../../Components/UserAvatar";
import { ChatItem, MessageNoUsers, UserMin } from "../../types";
import { MessageStackNavigationParams } from "../../types/navigation/MessagesStack";
import { definitions } from "../../types/supabase";
import { AppContext } from "../../utils/appContext";
import { queryClient } from "../../utils/queryClient";
import supabaseClient from "../../utils/supabaseClient";
import { getTimeDistance } from "../../utils/utils";

type Props = {
	route: RouteProp<MessageStackNavigationParams, "ChatList">;
	navigation: StackNavigationProp<MessageStackNavigationParams, "ChatList">;
};

type UserItemProps = {
	item: ChatItem;
	openMessage: (user: UserMin) => void;
	ownLastMessage: boolean;
};

const UserListItem: React.FC<UserItemProps> = ({
	item,
	openMessage,
	ownLastMessage,
}) => {
	return (
		<TouchableOpacity
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				margin: 16,
			}}
			onPress={() => openMessage(item.user)}
		>
			<UserAvatar size={32} profilePicture={item.user.profilePic} />
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
					{item.user.username}
				</Text>
				<Caption>
					{(() => {
						switch (item.message_type) {
							case "TEXT":
								return item.text;
							case "POST":
								return `${
									ownLastMessage ? "You sent" : "Sent"
								} ${item.post?.user}'s post`;
							case "STORY":
								return `${
									ownLastMessage ? "You sent" : "Sent"
								} ${item.story?.user}'s story`;
							case "STORYREPLY":
								return `${
									ownLastMessage ? "You replied" : "Replied"
								} to ${item.story?.user}'s story`;
							case "IMAGE":
								return `${
									ownLastMessage ? "You sent" : "Sent"
								} an image`;
							default:
								return "";
						}
					})()}{" "}
					- {getTimeDistance(item.received_at)}
				</Caption>
			</View>
		</TouchableOpacity>
	);
};

const MessagesList: React.FC<Props> = ({ navigation }) => {
	const { colors, dark } = useTheme();
	const { height } = useWindowDimensions();

	const { data, isLoading, refetch } = useQuery(`chatList`, () =>
		getChatsForUser()
	);

	const { user: currentUser } = useContext(AppContext);
	const newMessageReceived = async (
		payload: SupabaseRealtimePayload<definitions["messages"]>
	) => {
		const message = payload.new;
		await queryClient.cancelQueries(`messagesByUser_${message.sender}`);
		const previousMessages = queryClient.getQueryData<
			MessageNoUsers[] | null | undefined
		>(`messagesByUser_${message.sender}`);

		if (previousMessages) {
			const tempMessages = previousMessages;
			tempMessages.push(message);
			queryClient.setQueryData<MessageNoUsers[]>(
				`messagesByUser_${message.sender}`,
				[...tempMessages]
			);
		}
		DeviceEventEmitter.emit("newMessage", message);
		// queryClient.invalidateQueries(
		// 	`messagesByUser_${route.params.username}`
		// );
		queryClient.invalidateQueries(`chatList`);
	};

	useEffect(() => {
		if (currentUser) {
			const messageSubscription = supabaseClient
				.from<definitions["messages"]>(
					`messages:receiver=eq.${currentUser.username}`
				)
				.on("INSERT", newMessageReceived)
				.subscribe();

			return () => {
				supabaseClient.removeSubscription(messageSubscription);
			};
		}
	}, [currentUser]);

	const [searchTerm, setSearchTerm] = useState("");
	const goBack = () => navigation.goBack();

	const newMessage = () => navigation.navigate("NewChat");

	const openMessage = (user: UserMin) =>
		navigation.navigate("Messages", user);

	const [searchResults, setSearchResults] = useState<ChatItem[] | null>();

	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			if (searchTerm.length > 0) {
				setSearchResults(
					data?.filter(
						(item) =>
							item.user.username.includes(
								searchTerm.toLowerCase()
							) ||
							item.user.name.includes(searchTerm.toLowerCase())
					)
				);
			} else {
				setSearchResults(null);
			}
		}
		return () => {
			isMounted = false;
		};
	}, [data, searchTerm]);

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
			{currentUser && (
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
							: data?.sort(
									(a, b) =>
										new Date(b.received_at).getTime() -
										new Date(a.received_at).getTime()
							  )
					}
					ItemSeparatorComponent={Divider}
					renderItem={({ item }) => (
						<UserListItem
							item={item}
							openMessage={openMessage}
							ownLastMessage={
								item.lastMessageBy === currentUser.username
							}
						/>
					)}
					keyExtractor={(item) => item.user.username}
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
			)}
		</View>
	);
};

export default MessagesList;
