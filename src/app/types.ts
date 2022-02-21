import { definitions } from "./types/supabase";

export type Theme = "light" | "dark";

export type User = {
	username: string;
	email: string;
	name: string;
	bio?: string;
	profilePic?: string;
};

export type StoryListType = {
	user: UserMin;
	stories: Array<
		Pick<definitions["stories"], "id" | "imageUrl" | "postedAt">
	>;
};
export type UserMin = Pick<
	definitions["users"],
	"name" | "username" | "profilePic"
>;

export type LikeFull = Pick<definitions["likes"], "id" | "postId"> & {
	user: UserMin;
};

export type CommentFull = Pick<
	definitions["comments"],
	"comment" | "postId" | "postedAt" | "id" | "parentId"
> & {
	user: UserMin;
};

export type PostFull = Pick<
	definitions["posts"],
	"caption" | "imageUrl" | "postId" | "postedAt"
> & {
	user: UserMin;
	likes: Array<LikeFull>;
	isLiked: boolean;
};

export type StoryFull = Pick<
	definitions["stories"],
	"imageUrl" | "id" | "postedAt"
> & {
	user: UserMin;
};

export type PostWithUser = Pick<
	definitions["posts"],
	"caption" | "imageUrl" | "postId" | "postedAt"
> & {
	user: UserMin;
};

export type StoryWithUser = Pick<
	definitions["stories"],
	"imageUrl" | "id" | "postedAt"
> & {
	user: UserMin;
};

export type FollowerFull = Pick<
	definitions["followers"],
	"id" | "following"
> & {
	follower: UserMin;
};

export type FollowingFull = Pick<
	definitions["followers"],
	"id" | "follower"
> & {
	following: UserMin;
};

export type ChatItem = {
	user: UserMin;
	lastMessageBy: string;
	text?: string;
	message_type: string;
	received_at: string;
	imageUrl?: string;
	post?: definitions["posts"];
	story?: definitions["stories"];
};

export type MessageNoUsers = Pick<
	definitions["messages"],
	| "imageUrl"
	| "messageId"
	| "message_type"
	| "received_at"
	| "text"
	| "sender"
	| "receiver"
	| "storyId"
	| "postId"
> & {
	post?: definitions["posts"];
};

export type MessageFull = Pick<
	definitions["messages"],
	| "imageUrl"
	| "messageId"
	| "message_type"
	| "received_at"
	| "text"
	| "postId"
	| "storyId"
> & {
	sender: UserMin;
	receiver: UserMin;
	post?: definitions["posts"];
};
export type UserFull = definitions["users"] & {
	posts: definitions["posts"][];
	stories: definitions["stories"][];
	following: FollowingFull[];
	followers: FollowerFull[];
	isFollowing: boolean;
};

export type Notification = Pick<
	definitions["notifications"],
	"createdOn" | "id" | "type" | "toUser"
> & {
	byUser: UserMin;
	post?: Pick<
		definitions["posts"],
		"caption" | "imageUrl" | "postedAt" | "postId"
	>;
	comment?: Pick<definitions["comments"], "comment" | "id" | "postedAt">;
};

export type StoryViews = Pick<definitions["storyviews"], "id" | "storyId"> & {
	user: UserMin;
};
