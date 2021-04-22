import { format, formatDistanceToNow } from "date-fns";
import { Message } from "../store/MessagesStore";
import { Post } from "../store/PostsStore";
import { definitions } from "../types/supabase";

export const getUsersList = (
	messageListData: Message[],
	currentUser: string
) => {
	const users = messageListData.map((msg) => ({
		username: msg.sender === currentUser ? msg.receiver : msg.sender,
		messageType: msg.message_type,
		text: msg.text,
		lastMessageAt: msg.received_at,
	}));

	return [...new Map(users.map((item) => [item.username, item])).values()];
};

export function uniqueList<Model>(
	oldList: Model[],
	newList: Model[],
	key: keyof Model
) {
	const temp = [...oldList, ...newList];
	return [...new Map(temp.map((item) => [item[key], item])).values()];
}

export const mapPosts = (allPosts: definitions["posts"][]) =>
	allPosts.map(
		(post) =>
			({
				...post,
				postedAt: new Date(post.postedAt).toISOString(),
			} as Post)
	);

export const getTimeDistance = (time: string) =>
	new Date(time).getTime() > new Date().getTime() - 1 * 24 * 60 * 60 * 1000
		? `${formatDistanceToNow(new Date(time))} ago`
		: format(new Date(time), "LLLL dd, yyyy");
