import { SupabaseRealtimePayload } from "@supabase/supabase-js";
import { useContext, useEffect, useRef, useState } from "react";
import MessagesStore, { Message } from "../store/MessagesStore";
import { definitions } from "../types/supabase";
import { AppContext } from "./appContext";
import supabaseClient from "./supabaseClient";
import {
	deleteMessageFromDb,
	getMessagesFromDb,
	newMessageInDb,
} from "./supabaseUtils";

type ReturnType = {
	messages: Message[];
	loading: boolean;
	fetchMessages: () => void;
	newMessage: (
		newMessage: Pick<
			Message,
			"receiver" | "text" | "imageUrl" | "message_type" | "postId"
		>
	) => void;
	deleteMessage: (messageId: number) => void;
};
const useMessages = (username: string): ReturnType => {
	const [messages, setMessages] = useState<Array<Message>>([]);
	const [loading, setLoading] = useState(true);

	const { username: currentUser } = useContext(AppContext);

	const fetchMessagesData = async () => {
		if (!username || !currentUser) return null;
		try {
			const messagesData = await getMessagesFromDb(username);
			return {
				messagesData,
			};
		} catch (err) {
			console.error("[fetchMessagesData]", err);
			return {
				messagesData: null,
			};
		}
	};

	const messagesRef = useRef(messages);

	useEffect(() => {
		messagesRef.current = messages;
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
		if (payload.new.sender === username) {
			setMessages([...messagesRef.current, receivedMessage]);
		}
	};

	useEffect(() => {
		if (!currentUser) {
			return;
		} else {
			const messagesSubscription = supabaseClient
				.from<definitions["messages"]>(
					`messages:receiver=eq.${currentUser}`
				)
				.on("INSERT", newMessageReceived)
				.subscribe();

			return () => {
				supabaseClient.removeSubscription(messagesSubscription);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, messagesRef.current]);

	const deleteMessage = async (messageId: number) => {
		const tempMessages = messages.filter(
			(message) => message.messageId !== messageId
		);
		setMessages(tempMessages);
		await deleteMessageFromDb(messageId);
		MessagesStore.deleteMessage(messageId);
	};

	const fetchMessages = async () => {
		try {
			const messagesData = await fetchMessagesData();
			if (messagesData?.messagesData)
				setMessages(messagesData.messagesData);
			setLoading(false);
		} catch (err) {
			console.error("[fetchMessages]", err);
			setLoading(false);
		}
	};

	const newMessage = async (
		messageToSend: Pick<
			Message,
			"receiver" | "text" | "imageUrl" | "message_type" | "postId"
		>
	) => {
		const newMessageData = await newMessageInDb(messageToSend);
		if (newMessageData) {
			setMessages([...messages, newMessageData]);
			MessagesStore.addMessage(newMessageData);
		}
	};

	useEffect(() => {
		if (username && currentUser) {
			const fetchedMessages = MessagesStore.messages
				.filter((message) =>
					[username, currentUser].includes(
						message.sender || message.received_at
					)
				)
				.sort(
					(a, b) =>
						new Date(b.received_at).getTime() -
						new Date(a.received_at).getTime()
				);
			if (fetchedMessages) setMessages(fetchedMessages);
		}
	}, [username, currentUser]);

	useEffect(() => {
		if (username) fetchMessages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);

	if (!username)
		return {
			messages: [],
			loading: false,
			fetchMessages,
			newMessage,
			deleteMessage,
		};
	return { messages, loading, fetchMessages, newMessage, deleteMessage };
};

export default useMessages;
