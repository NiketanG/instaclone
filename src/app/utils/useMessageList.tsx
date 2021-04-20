import { useContext, useEffect, useState } from "react";
import MessagesStore, { Message } from "../store/MessagesStore";
import { AppContext } from "./appContext";
import { getMessageListFromDb } from "./supabaseUtils";

type ReturnType = {
	messageList: Message[];
	loading: boolean;
	fetchMessageList: () => void;
};
const useMessageList = (): ReturnType => {
	const [messageList, setMessageList] = useState<Array<Message>>([]);
	const [loading, setLoading] = useState(true);

	const { username: currentUser } = useContext(AppContext);

	const fetchMessageListData = async () => {
		try {
			const messageListData = await getMessageListFromDb();

			return {
				messageList: messageListData,
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
						message.sender === currentUser ||
						message.receiver === currentUser
				)
				.sort(
					(a, b) =>
						new Date(b.received_at).getTime() -
						new Date(a.received_at).getTime()
				);
			if (messageListData) setMessageList(messageListData);
			setLoading(false);
		}
	}, [currentUser]);

	const fetchMessageList = async () => {
		const messageListData = await fetchMessageListData();
		if (messageListData?.messageList)
			setMessageList(messageListData.messageList);
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

export default useMessageList;
