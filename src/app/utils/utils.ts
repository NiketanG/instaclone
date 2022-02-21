import { format, formatDistanceToNowStrict } from "date-fns";
import { ChatItem, MessageFull, StoryListType, StoryWithUser } from "../types";
import { definitions } from "../types/supabase";

export const parseParams = (queryString: string) => {
	var params: { [key: string]: string } = {},
		queries,
		temp,
		i,
		l;

	// Split into key/value pairs
	queries = queryString.split("&");

	// Convert the array of strings into an object
	for (i = 0, l = queries.length; i < l; i++) {
		temp = queries[i].split("=");
		params[temp[0]] = temp[1];
	}

	return params;
};

export function groupStoriesByUser(list: Array<StoryWithUser>) {
	const usersList = [...new Set(list.map((item) => item.user.username))];

	const allStories: {
		[key: string]: StoryListType;
	} = {};

	usersList.forEach((item) => {
		const stories = list.filter((story) => story.user);

		if (stories.length > 0) {
			allStories[item] = {
				stories,
				user: stories[0].user,
			};
		}
	});

	return allStories;
}

export const getUsersList = (
	messageListData: MessageFull[],
	currentUser: string
): ChatItem[] => {
	const users: ChatItem[] = messageListData.map((msg) => ({
		user: msg.sender.username === currentUser ? msg.receiver : msg.sender,
		lastMessageBy:
			messageListData[messageListData.length - 1].sender.username,
		...msg,
	}));

	return [
		...new Map(users.map((item) => [item.user.username, item])).values(),
	];
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
			} as definitions["posts"])
	);

export const mapStories = (allStories: definitions["stories"][]) =>
	allStories.map(
		(story) =>
			({
				...story,
				postedAt: new Date(story.postedAt).toISOString(),
			} as definitions["stories"])
	);

export const getTimeDistance = (time: string) =>
	new Date(time).getTime() > new Date().getTime() - 1 * 24 * 60 * 60 * 1000
		? formatDistanceToNowStrict(new Date(time)) === "0 seconds"
			? "Just now"
			: formatDistanceToNowStrict(new Date(time))
		: format(new Date(time), "LLLL dd, yyyy");
