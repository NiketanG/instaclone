import { Instance, SnapshotOut, types, flow } from "mobx-state-tree";
import { getMessagesFromDb } from "../utils/supabaseUtils";
import { uniqueList } from "../utils/utils";

export const MessageModel = types.model("Message", {
	messageId: types.identifierNumber,
	message_type: types.string,

	text: types.maybe(types.string),
	postId: types.maybe(types.number),
	imageUrl: types.maybe(types.string),

	sender: types.string,
	receiver: types.string,
	received_at: types.string,
});

const MessagesStore = types
	.model("Messages", {
		messages: types.array(MessageModel),
	})
	.actions((self) => {
		const setMessages = (messages: Array<Message>) => {
			self.messages.replace(messages);
		};

		const addMessages = (messages: Array<Message>) => {
			self.messages.replace(
				uniqueList<Message>(self.messages, messages, "messageId")
			);
		};

		const addMessage = (newMessage: Message) => {
			if (
				!self.messages.find(
					(message) => message.messageId === newMessage.messageId
				)
			)
				self.messages.push(newMessage);
		};

		const deleteMessage = (messageId: number) => {
			self.messages.replace(
				self.messages.filter(
					(message) => message.messageId !== messageId
				)
			);
		};

		const getMessages = flow(function* (username: string) {
			if (!username) return;

			let messages: Message[] =
				self.messages.filter(
					(message) =>
						message.sender === username ||
						message.receiver === username
				) || [];
			try {
				const fetchedMessages = yield getMessagesFromDb(username);
				if (fetchedMessages) {
					messages = uniqueList<Message>(
						messages,
						fetchedMessages,
						"messageId"
					);

					self.messages.replace(
						uniqueList<Message>(
							self.messages,
							fetchedMessages,
							"messageId"
						)
					);
				}
			} catch (err) {
				console.error("[getLikes]", err);
			}
			return messages;
		});

		return {
			setMessages,
			addMessage,
			deleteMessage,
			getMessages,
			addMessages,
		};
	})
	.create({
		messages: [],
	});

type MessageType = Instance<typeof MessageModel>;
export interface Message extends MessageType {}

type MessageSnapshotType = SnapshotOut<typeof MessageModel>;
export interface MessageSnapshot extends MessageSnapshotType {}

export default MessagesStore;
