import AsyncStorage from "@react-native-async-storage/async-storage";
import { PostgrestResponse } from "@supabase/supabase-js";

import {
	ChatItem,
	CommentFull,
	LikeFull,
	MessageNoUsers,
	Notification,
	PostFull,
	PostWithUser,
	StoryFull,
	StoryViews,
	User,
	UserFull,
} from "../app/types";
import { definitions } from "../app/types/supabase";
import { queryClient } from "../app/utils/queryClient";
import supabaseClient from "../app/utils/supabaseClient";

import { getUsersList, groupStoriesByUser } from "../app/utils/utils";

export const getCurrentUser = async (): Promise<User | null> => {
	const currentUserString = await AsyncStorage.getItem("user");
	if (!currentUserString) {
		console.error("[getCurrentUser] No Current User");
		return null;
	}
	const currentUser = JSON.parse(currentUserString);
	if (!currentUser || !currentUser.username) {
		console.error("[getCurrentUser] JSON Parse Fail", currentUserString);
		return null;
	}
	return currentUser;
};

export function responseInterceptor<ResponseType>(
	response: PostgrestResponse<ResponseType>
) {
	if (!response) {
		console.error("[responseInterceptor] No Response");
		return Promise.reject(null);
	}
	if (response.error) {
		console.error(response.error);
		return Promise.reject(response.error);
	}
	return response.data;
}

export const getLikesForPost = async (postId: number) => {
	const response = await supabaseClient
		.from<"likes", definitions["likes"]>("likes")
		.select("*")
		.eq("postId", postId);

	return responseInterceptor(response) || [];
};

export const checkUserExists = async (email: string) => {
	const response = await supabaseClient
		.from<"users", definitions["users"]>("users")
		.select("*")
		.eq("email", email)
		.single();

	if (response && response.data) return response.data as definitions["users"];

	return null;
};

export const isUsernameAvailable = async (username: string) => {
	const { data, error } = await supabaseClient
		.from<"users", definitions["users"]>("users")
		.select("*")
		.eq("username", username.toLowerCase())
		.maybeSingle();
	if (error) {
		console.error("[isUsernameAvailable]", error);
	}
	return data ? false : true;
};

export const editUser = async (
	user: Partial<
		Pick<definitions["users"], "name" | "username" | "bio" | "profilePic">
	>
) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;

	const dataToUpdate: Partial<
		Pick<definitions["users"], "username" | "name" | "bio" | "profilePic">
	> = {};
	if (user.bio) dataToUpdate.bio = user.bio;
	if (user.username && currentUser.username !== user.username) {
		const usernameAvailable = await isUsernameAvailable(user.username);
		if (usernameAvailable === true) dataToUpdate.username = user.username;
		if (!usernameAvailable) return null;
	}
	if (user.name) dataToUpdate.name = user.name;
	if (user.profilePic) dataToUpdate.profilePic = user.profilePic;

	const { data, error } = await supabaseClient
		.from<"users", definitions["users"]>("users")
		.update(dataToUpdate)
		.match({
			username: currentUser.username,
		} as definitions["users"]);

	if (error) {
		console.error("[editUser]", error);
		return null;
	}
	return data && data.length > 0 ? data : null;
};

export const getFollowingForUser = async (
	username: string
): Promise<definitions["followers"][] | null> => {
	if (!username || username.length === 0) return null;
	const response = await supabaseClient
		.from<"followers", definitions["followers"]>("followers")
		.select("*")
		.eq("follower", username.toLowerCase());
	return responseInterceptor(response) || [];
};

export const getFollowersForUser = async (
	username: string
): Promise<definitions["followers"][] | null> => {
	if (!username || username.length === 0) return null;
	const response = await supabaseClient
		.from<"followers", definitions["followers"]>("followers")
		.select("*")
		.eq("following", username.toLowerCase());
	return responseInterceptor(response) || [];
};

export const checkIfFollowing = async (username: string) => {
	if (!username) return null;
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;

	const { data, error } = await supabaseClient
		.from<"followers", definitions["followers"]>("followers")
		.select("*")
		.eq("follower", currentUser.username)
		.eq("following", username)
		.maybeSingle();

	if (error) {
		console.error("[checkIfFollowing]", error);
		return null;
	}
	return data;
};

export const followUser = async (
	username: string
): Promise<definitions["followers"] | null> => {
	if (!username) return null;
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	const isFollowing = await checkIfFollowing(username);
	if (isFollowing) return isFollowing;

	const { data, error } = await supabaseClient.from("followers").insert({
		follower: currentUser.username,
		following: username,
	});

	if (error) {
		console.error("[followUser]", error);
		return null;
	}
	if (!data) return null;
	if (data.length > 0) {
		newNotification({
			toUser: username,
			type: "FOLLOW",
		});
		return data as any;
	}
	return null;
};

export const unfollowUser = async (username: string): Promise<boolean> => {
	if (!username) return false;
	const currentUser = await getCurrentUser();
	if (!currentUser) return false;
	const isFollowing = await checkIfFollowing(username);
	if (!isFollowing) return false;

	const { data, error } = await supabaseClient
		.from<"followers", definitions["followers"]>("followers")
		.delete()
		.match({
			follower: currentUser.username,
			following: username,
		});
	if (error) {
		console.error("[followUser]", error);
		return false;
	}
	if (!data) return false;
	deleteNotification({
		toUser: username,
		type: "FOLLOW",
	});
	return true;
};

export const toggleFollow = async (username: string) => {
	try {
		const isFollowing = await checkIfFollowing(username);
		if (isFollowing) {
			return await followUser(username);
		} else {
			await unfollowUser(username);
			return null;
		}
	} catch (err) {
		console.error("[toggleFollow]", err);
		return null;
	}
};

export const checkNotificationExists = async (
	notification: Pick<
		definitions["notifications"],
		"comment" | "post" | "toUser" | "type"
	>
) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return false;
	const dataToMatch = {
		byUser: currentUser.username,
		toUser: notification.toUser,
		type: notification.type,
	} as definitions["notifications"];

	if (notification.post) dataToMatch.post = notification.post;
	if (notification.comment) dataToMatch.comment = notification.comment;
	const { data, error } = await supabaseClient
		.from<"notifications", definitions["notifications"]>("notifications")
		.select("*")
		.match(dataToMatch as definitions["notifications"])
		.maybeSingle();

	if (error) {
		console.error("[checkNotificationExists]", error);
		return null;
	}
	return data ? true : false;
};

export const deleteNotification = async (
	notification: Pick<
		definitions["notifications"],
		"comment" | "post" | "toUser" | "type"
	>
) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	if (notification.toUser === currentUser.username) return null;
	const dataToMatch = {
		byUser: currentUser.username,
		toUser: notification.toUser,
		type: notification.type,
	} as definitions["notifications"];

	if (notification.post) dataToMatch.post = notification.post;
	if (notification.comment) dataToMatch.comment = notification.comment;

	const { data, error } = await supabaseClient
		.from("notifications")
		.delete()
		.match(dataToMatch as definitions["notifications"]);

	if (error) {
		console.error("[deleteNotification]", error);
		return null;
	}
	return data ? true : false;
};

export const newNotification = async (
	notification: Pick<
		definitions["notifications"],
		"comment" | "post" | "toUser" | "type"
	>
) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	if (notification.toUser === currentUser.username) return null;
	const notificationExists = await checkNotificationExists(notification);
	if (notificationExists === null) return;
	if (notificationExists) return notificationExists;

	const dataToInsert = {
		byUser: currentUser.username,
		toUser: notification.toUser,
		type: notification.type,
	} as definitions["notifications"];

	if (notification.post) dataToInsert.post = notification.post;
	if (notification.comment) dataToInsert.comment = notification.comment;

	const { data, error } = await supabaseClient
		.from<"notifications", definitions["notifications"]>("notifications")
		.insert(dataToInsert);

	if (error) {
		console.error("[newNotification]", error);
		return null;
	}
	return data && data.length > 0 ? data[0] : null;
};

export const getPostById = async (
	postId: number | null
): Promise<PostFull | null> => {
	if (!postId) return null;
	const { data, error } = await supabaseClient
		.from("posts")
		.select(
			`
		*,
		user (
			name,
			profilePic,
			username
		),
		likes (
			*,
			user:likes_user_key (
				name,
				profilePic,
				username
			)
		)`
		)
		.eq("postId", postId)
		.maybeSingle();

	if (error) {
		console.error("[getPostById]", error);
		return null;
	}
	return {
		...data,
		isLiked: data.likes.find((like: LikeFull) => like.user.username)
			? true
			: false,
	};
};

export const getStoryById = async (
	storyId: number | null | undefined
): Promise<StoryFull | null> => {
	if (!storyId) return null;
	const { data, error } = await supabaseClient
		.from<"stories", definitions["stories"]>("stories")
		.select(
			`
		*,
		user (
			name,
			profilePic,
			username
		)`
		)
		.eq("id", storyId)
		.maybeSingle();

	if (error) {
		console.error("[getPostById]", error);
		return null;
	}
	return data as any;
};

export const getFeedPosts = async (): Promise<PostWithUser[] | null> => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;

	const followingList = await getFollowingForUser(currentUser.username);

	if (!followingList) return null;
	const usersList = followingList.map((item) => item.following);
	const response = await supabaseClient
		.from("posts")
		.select(
			`
			*,
			user (
				name,
				profilePic,
				username
			)`
		)
		.in("user", usersList);

	const ownPosts = await supabaseClient
		.from("posts")
		.select(
			`
			*,
			user (
				name,
				profilePic,
				username
			)`
		)
		.eq("user", currentUser.username);

	const feedPostList = await responseInterceptor(response);

	const ownPostList = await responseInterceptor(ownPosts);

	const tempPostList: PostFull[] = [...feedPostList, ...ownPostList];

	return tempPostList.sort(
		(a, b) =>
			new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
	);
};

export const getFeedStories = async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser)
		return {
			ownStories: null,
			stories: null,
		};

	const followingList = await getFollowingForUser(currentUser.username);

	if (!followingList)
		return {
			ownStories: null,
			stories: null,
		};
	const usersList = followingList.map((item) => item.following);

	const storyTime = new Date();
	storyTime.setHours(storyTime.getHours() - 24);
	const response = await supabaseClient
		.from("stories")
		.select(
			`
			*,
			user (
				name,
				profilePic,
				username
			)`
		)
		.gte("postedAt", storyTime.toISOString())
		.in("user", usersList);

	const ownPosts = await supabaseClient
		.from("stories")
		.select(
			`
			*,
			user (
				name,
				profilePic,
				username
			)`
		)
		.gte("postedAt", storyTime.toISOString())
		.eq("user", currentUser.username);
	const feedStories = await responseInterceptor(response);

	const ownStories = await responseInterceptor(ownPosts);

	return {
		ownStories: groupStoriesByUser(ownStories),
		stories: groupStoriesByUser(
			feedStories.sort(
				(a, b) =>
					new Date(b.postedAt).getTime() -
					new Date(a.postedAt).getTime()
			)
		),
	};
};

export const getUser = async (username: string): Promise<UserFull | null> => {
	const { data, error } = await supabaseClient
		.from<"users", definitions["users"]>("users")
		.select(
			`
				*,
				posts:posts_user_key (
					*
				),
				stories:storiees_user_fkey (
					*
				),
				following:followers_follower_fkey (
					following (
						*
					)
				),
				followers:followers_following_fkey (
					follower (
						*
					)
				)
		`
		)
		.eq("username", username.toLowerCase())
		.single();
	if (error) console.error("[getUser]", error);
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	if (!data) return null;
	const user: UserFull = data as any;
	user.isFollowing = user.followers.find(
		(item) => item.follower.username === currentUser.username
	)
		? true
		: false;
	return user;
};

export const newStory = async (
	storyData: Pick<definitions["stories"], "imageUrl">
) => {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser) return null;
		const { data, error } = await supabaseClient
			.from<"stories", definitions["stories"]>("stories")
			.insert({
				imageUrl: storyData.imageUrl,
				user: currentUser.username,
			});

		if (error) {
			console.error("[newStory]", error);
			return null;
		}

		return data && data.length > 0 ? data[0] : null;
	} catch (err) {
		console.error("[newStory]", err);
		return null;
	}
};

export const deleteStory = async (storyId: number) => {
	if (!storyId) return false;
	const currentUser = await getCurrentUser();

	if (!currentUser) return false;

	try {
		const { data, error } = await supabaseClient
			.from<"stories", definitions["stories"]>("stories")
			.delete()
			.match({
				id: storyId,
				user: currentUser.username,
			} as definitions["stories"]);
		if (error) {
			console.error("[deleteStory]", error);
			return false;
		}
		if (!data) return false;
		if (data.length > 0) {
			const deletedStory = data[0];
			if (!deletedStory.imageUrl) return true;
			const imageName = deletedStory.imageUrl.substring(
				"stories/".length + deletedStory.imageUrl.indexOf("stories/")
			);
			supabaseClient.storage.from("stories").remove([imageName]);
			return true;
		}

		return false;
	} catch (err) {
		console.error("[deleteStory]", err);
		return false;
	}
};

export const isStoryViewed = async (storyId: number) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	const { data, error } = await supabaseClient
		.from<"storyviews", definitions["storyviews"]>("storyviews")
		.select("*")
		.eq("user", currentUser.username)
		.eq("storyId", storyId)
		.maybeSingle();

	if (error) {
		console.error("[setStoryViewed]", error);
		return null;
	}

	if (!data) return null;

	return data ? true : false;
};

export const setStoryViewed = async (storyId: number) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;

	const checkIsViewed = await isStoryViewed(storyId);
	if (checkIsViewed === null || checkIsViewed === true) return null;
	if (checkIsViewed === false) {
		const { data, error } = await supabaseClient
			.from<"storyviews", definitions["storyviews"]>("storyviews")
			.insert({
				storyId,
				user: currentUser.username,
			})
			.single();
		if (error) {
			console.error("[setStoryViewed]", error);
			return null;
		}
		return data;
	}
	return null;
};

export const getViewsForStory = async (
	storyId: number | null | undefined
): Promise<StoryViews[] | null> => {
	if (!storyId) return null;
	const { data, error } = await supabaseClient
		.from<"storyviews", definitions["storyviews"]>("storyviews")
		.select(
			`
			*,
			user:storyviews_user_fkey (
				*
			)
			`
		)
		.eq("storyId", storyId);

	if (error) console.error("[getUser]", error);
	// const currentUser = await getCurrentUser();
	// if (!currentUser) return null;
	return data as any;
};

export const getNotifications = async (): Promise<Notification[] | null> => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	const { data, error } = await supabaseClient
		.from<"notifications", definitions["notifications"]>("notifications")
		.select(
			`
				*,
				post: notifications_post_fkey (
					*
				),
				byUser: notifications_byUser_fkey (
					*
				)
				comment: notifications_comment_fkey (
					*
				)
				`
		)
		.eq("toUser", currentUser.username);

	if (error) {
		console.error("[getNotifications]", error);
		return null;
	}
	if (!data) return null;
	return data.length > 0 ? (data as any) : null;
};

export const checkIfLiked = async (
	postId: number
): Promise<LikeFull | null> => {
	if (!postId) return null;
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;

	const { data, error } = await supabaseClient
		.from<"likes", definitions["likes"]>("likes")
		.select(
			`
		*,
		user (
			name,
			username,
			profilePic
		)`
		)
		.eq("postId", postId)
		.eq("user", currentUser.username)
		.maybeSingle();

	if (error) {
		console.error("[checkIfLiked]", error);
		return null;
	}
	return data as any;
};

export const likePost = async (postId: number): Promise<LikeFull | null> => {
	if (!postId) return null;
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	const isLiked = await checkIfLiked(postId);
	if (isLiked) return isLiked;

	const { data, error } = await supabaseClient.from("likes").insert({
		postId,
		user: currentUser.username,
	});
	if (error) {
		console.error("[likePost]", error);
		return null;
	}
	if (!data) return null;
	return data.length > 0 ? (data as any) : null;
};

export const unlikePost = async (postId: number): Promise<boolean> => {
	if (!postId) return false;
	const currentUser = await getCurrentUser();
	if (!currentUser) return false;
	const isLiked = await checkIfLiked(postId);
	if (!isLiked) return false;

	const { data, error } = await supabaseClient.from("likes").delete().match({
		postId,
		user: currentUser.username,
	});
	if (error) {
		console.error("[unlikePost]", error);
		return false;
	}
	if (!data) return false;
	return true;
};

export const toggleLike = async (postId: number) => {
	try {
		const isLiked = await checkIfLiked(postId);
		const postData = queryClient.getQueryData<PostFull | null | undefined>(
			`postInfo_${postId}`
		);

		if (isLiked) {
			if (postData)
				deleteNotification({
					toUser: postData.user.username,
					type: "LIKE",
					post: postId,
				});
			return await unlikePost(postId);
		} else {
			if (postData)
				newNotification({
					toUser: postData.user.username,
					type: "LIKE",
					post: postId,
				});
			return await likePost(postId);
		}
	} catch (err) {
		console.error("[toggleLikeInDb]", err);
		return null;
	}
};

export interface CommentWithUser extends CommentFull {
	user: Pick<User, "name" | "profilePic" | "username">;
}

export interface NestedComments extends CommentWithUser {
	replies?: NestedComments[];
	parent?: CommentWithUser;
}

export const getCommentsOnPost = async (
	postId: number
): Promise<NestedComments[] | null> => {
	const userRelationFields = `
		name,
		username,
		profilePic
	`;

	const commentFields = `
		*,
		user (
			${userRelationFields}
		)
	`;

	const { data, error } = await supabaseClient
		.from<CommentWithUser>("comments")
		.select(
			`
		${commentFields},
		parent:parentId (
			${commentFields}
		)
	`
		)
		.eq("postId", postId);

	if (error) {
		console.error("[getCommentsOnPost]", error);
		return null;
	}
	if (!data) return null;

	const nestedComments: NestedComments[] = [];

	for (let i = 0; i < data.length; i++) {
		const comment = data[i];

		const idx = nestedComments.findIndex(
			(item) => item.id === comment.parentId
		);

		if (idx === -1) {
			nestedComments.push({ ...comment, replies: [] });
		} else {
			nestedComments[idx].replies?.push(comment);
		}
	}

	return nestedComments;
};

export const addComment = async (
	comment: Pick<definitions["comments"], "comment" | "postId" | "user">
): Promise<CommentFull | null> => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	const { data, error } = await supabaseClient
		.from<"comments", definitions["comments"]>("comments")
		.insert({
			...comment,
			user: currentUser.username,
		}).select(`
		*,
		user:comments_user_key (
			name,
			username,
			profilePic
		)
		`);
	if (error) {
		console.error("[addComment]", error);
		return null;
	}
	if (!data) return null;
	if (data.length > 0) {
		const postData = queryClient.getQueryData<PostFull | null | undefined>(
			`postInfo_${comment.postId}`
		);
		if (postData)
			newNotification({
				toUser: postData.user.username,
				type: "COMMENT",
				post: comment.postId,
				comment: data[0].id,
			});
		return data as any;
	}
	return null;
};

export const deleteComment = async (commentId: number) => {
	if (!commentId) return false;
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;

	const postForComment = await supabaseClient
		.from<"comments", definitions["comments"]>("comments")
		.select("*")
		.eq("id", commentId)
		.maybeSingle();

	if (postForComment.data) {
		const postInfo = await supabaseClient
			.from<"posts", definitions["posts"]>("posts")
			.select("*")
			.eq("postId", postForComment.data.postId)
			.maybeSingle();
		if (postInfo.data)
			await deleteNotification({
				toUser: postInfo.data.user,
				type: "COMMENT",
				post: postForComment.data.postId,
				comment: commentId,
			});
	}

	const { data, error } = await supabaseClient
		.from("comments")
		.delete()
		.match({
			id: commentId,
			user: currentUser.username,
		});

	if (error) {
		console.error("[deleteComment]", error);
		return false;
	}
	if (!data) return false;

	if (data) {
		return data as any;
	}
	return null;
};

export const newPost = async (
	postData: Pick<definitions["posts"], "caption" | "imageUrl">
) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	const { data, error } = await supabaseClient
		.from<"posts", definitions["posts"]>("posts")
		.insert({
			...postData,
			user: currentUser.username,
		});

	if (error) {
		console.error("[newPost]", error);
		return null;
	}
	if (!data) return null;
	return data.length > 0 ? data[0] : null;
};

export const editPost = async (
	post: Pick<definitions["posts"], "caption" | "postId">
) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;

	const { data, error } = await supabaseClient
		.from<"posts", definitions["posts"]>("posts")
		.update({
			caption: post.caption,
		})
		.match({
			postId: post.postId,
			user: currentUser.username,
		} as definitions["posts"]);

	if (error) {
		console.error("[editPost]", error);
		return null;
	}
	return data && data.length > 0 ? data : null;
};

export const deletePost = async (postId: number) => {
	if (!postId) return false;
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	const { data, error } = await supabaseClient
		.from<"posts", definitions["posts"]>("posts")
		.delete()
		.match({
			postId,
			user: currentUser.username,
		});
	if (error) {
		console.error("[deletePost]", error);
		return false;
	}
	if (!data) return false;
	if (data.length > 0) {
		const deletedPost = data[0];
		if (!deletedPost.imageUrl) return true;
		const imageName = deletedPost.imageUrl.substring(
			"posts/".length + deletedPost.imageUrl.indexOf("posts/")
		);
		supabaseClient.storage.from("posts").remove([imageName]);
		return true;
	}

	return false;
};

export const getChatsForUser = async (): Promise<ChatItem[] | null> => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	const { data, error } = await supabaseClient
		.from("messages")
		.select(
			`
			*,
			sender: messages_sender_fkey(
				name,
				username,
				profilePic
			),
			receiver: messages_receiver_fkey (
				name,
				username,
				profilePic
			),
			post: messages_postId_fkey (
				*
			),
			story: messages_storyId_fkey (
				*
			)
			`
		)
		.or(
			`sender.eq.${currentUser.username},receiver.eq.${currentUser.username}`
		)
		.order("received_at");

	if (error) {
		console.error("[getChatsForUser]", error);
		return null;
	}
	if (data) return getUsersList(data, currentUser.username);
	return null;
};

export const getMessagesByUser = async (
	username: string
): Promise<MessageNoUsers[] | null> => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	const { data, error } = await supabaseClient
		.from("messages")
		.select(
			`
			*,
			post: messages_postId_fkey (
				*
			)
			`
		)
		.or(
			`sender.eq.${currentUser.username},receiver.eq.${currentUser.username}`
		)
		.or(`sender.eq.${username},receiver.eq.${username}`)
		.order("received_at");

	if (error) {
		console.error("[getMessagesByUser]", error);
		return null;
	}
	return data;
};

export const newMessage = async (
	message: Pick<
		definitions["messages"],
		"imageUrl" | "message_type" | "postId" | "text" | "receiver" | "storyId"
	>
): Promise<definitions["messages"] | null> => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return null;
	if (currentUser.username === message.receiver) return null;
	const { data, error } = await supabaseClient
		.from<"messages", definitions["messages"]>("messages")
		.insert({
			...message,
			sender: currentUser.username,
		});

	if (error) {
		console.error("[newMessage]", error);
		return null;
	}
	if (!data) return null;
	return data.length > 0 ? data[0] : null;
};

export const deleteMessage = async (messageId: number): Promise<boolean> => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return false;

	const { data, error } = await supabaseClient
		.from<"messages", definitions["messages"]>("messages")
		.delete()
		.match({
			messageId,
			sender: currentUser.username,
		} as Partial<definitions["messages"]>);
	if (error) {
		console.error("[deleteMessage]", error);
		return false;
	}

	if (!data) return false;
	if (data.length > 0) {
		const deletedMessage = data[0];
		if (!deletedMessage.imageUrl) return true;
		const imageName = deletedMessage.imageUrl.substring(
			"messages/".length + deletedMessage.imageUrl.indexOf("messages/")
		);
		supabaseClient.storage.from("messages").remove([imageName]);
		return true;
	}
	return false;
};

export const getExplorePosts = async (): Promise<PostFull[] | null> => {
	const { data, error } = await supabaseClient.from("posts").select(
		`
		*,
		user (
			name,
			profilePic,
			username
		),
		likes (
			*,
			user:likes_user_key (
				name,
				profilePic,
				username
			)
		)
		`
	);

	if (error) {
		console.error("[getExplorePosts]", error);
		return null;
	}
	return data;
};

export const searchUsers = async (searchTerm: string) => {
	if (searchTerm.length === 0) return null;
	const { data, error } = await supabaseClient
		.from<"users", definitions["users"]>("users")
		.select("*")
		.or(
			`name.ilike.%${searchTerm.toLowerCase()}%,username.ilike.%${searchTerm.toLowerCase()}%`
		);

	if (error) {
		console.error("[searchUsers]", error);
		return null;
	}
	return data;
};

export const setNotificationToken = async (token: string) => {
	const currentUser = await getCurrentUser();
	if (!currentUser) return false;

	if (!token || token.length === 0) return false;

	const { data, error } = await supabaseClient
		.from<"users", definitions["users"]>("users")
		.update({
			notificationToken: token,
		})
		.match({
			username: currentUser.username,
		} as definitions["users"]);

	if (error) {
		console.error("[setNotificationToken]", error);
		return false;
	}
	return data && data.length > 0 ? true : false;
};
