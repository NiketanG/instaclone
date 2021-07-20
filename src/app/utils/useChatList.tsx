import { SupabaseRealtimePayload } from "@supabase/supabase-js";
import { useContext, useEffect, useRef, useState } from "react";
import MessagesStore from "../store/MessagesStore";
import { definitions } from "../types/supabase";
import { AppContext } from "./appContext";
import supabaseClient from "./supabaseClient";
import { getMessageListFromDb } from "./supabaseUtils";
import { getUsersList } from "./utils";

export type ChatList = {
	username: string;
	lastMessageAt: string;
	text: string | undefined;
	messageType: string;
};
type ReturnType = {
	messageList: ChatList[];
	loading: boolean;
	fetchMessageList: () => void;
};

const useChatList = (): ReturnType => {
	const [messageList, setMessageList] = useState<Array<ChatList>>([]);
	const [loading, setLoading] = useState(true);

	const { user: currentUser } = useContext(AppContext);

	const messageListRef = useRef(messageList);
	useEffect(() => {
		messageListRef.current = messageList;
	});

	const newMessageReceived = (
		payload: SupabaseRealtimePayload<definitions["messages"]>
	) => {
		const receivedMessage = {
			messageId: payload.new.messageId,
			message_type: payload.new.message_type,
			postId: payload.new.postId || undefined,
			received_at: payload.new.received_at,
			receiver: payload.new.receiver,
			sender: payload.new.sender,
			text: payload.new.text || undefined,
			imageUrl: payload.new.imageUrl || undefined,
		};
		MessagesStore.addMessage(receivedMessage);

		const user =
			receivedMessage.sender === currentUser?.username
				? receivedMessage.receiver
				: receivedMessage.sender;

		const userExists = messageListRef.current.findIndex(
			(userToFind) => userToFind.username === user
		);
		const tempUserList = messageListRef.current;
		const newUser = {
			username: user,
			lastMessageAt: receivedMessage.received_at,
			messageType: receivedMessage.message_type,
			text: receivedMessage.text,
		};
		if (userExists !== -1) {
			tempUserList[userExists] = newUser;
		} else {
			tempUserList.push(newUser);
		}

		setMessageList([...tempUserList]);
	};

	useEffect(() => {
		if (!currentUser) {
			return;
		} else {
			const messagesSubscription = supabaseClient
				.from<definitions["messages"]>(
					`messages:receiver=eq.${currentUser?.username}`
				)
				.on("INSERT", newMessageReceived)
				.subscribe();

			return () => {
				supabaseClient.removeSubscription(messagesSubscription);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	const fetchMessageListData = async () => {
		if (!currentUser)
			return {
				messageList: null,
			};
		try {
			const messageListData = (await getMessageListFromDb()) || [];
			return {
				messageList: getUsersList(
					messageListData,
					currentUser?.username
				),
			};
		} catch (err) {
			console.error("[fetchUserData]", err);
			return {
				messageList: null,
			};
		}
	};

	useEffect(() => {
		if (currentUser) {
			const messageListData = MessagesStore.messages
				.filter(
					(message) =>
						message.sender === currentUser?.username ||
						message.receiver === currentUser?.username
				)
				.sort(
					(a, b) =>
						new Date(b.received_at).getTime() -
						new Date(a.received_at).getTime()
				);
			if (messageListData)
				setMessageList(
					getUsersList(messageListData, currentUser?.username)
				);
			setLoading(false);
		}
	}, [currentUser]);

	const fetchMessageList = async () => {
		const messageListData = await fetchMessageListData();
		if (messageListData?.messageList) {
			setMessageList(messageListData.messageList);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (currentUser) fetchMessageList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	if (!currentUser)
		return {
			loading,
			messageList: [],
			fetchMessageList,
		};

	return {
		loading,
		messageList,
		fetchMessageList,
	};
};

export default useChatList;
