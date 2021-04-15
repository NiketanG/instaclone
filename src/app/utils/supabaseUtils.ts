import AsyncStorage from "@react-native-async-storage/async-storage";
import { Follower } from "../store/FollowersStore";
import { Post } from "../store/PostsStore";
import UsersStore, { User } from "../store/UsersStore";
import { definitions } from "../types/supabase";

import supabaseClient from "./supabaseClient";
import mapPosts from "./utils";

export const checkFollowingInDb = async (username: string) => {
	try {
		const currentUser = await AsyncStorage.getItem("username");
		if (!currentUser) return false;

		const followingRes = await supabaseClient
			.from<definitions["followers"]>("followers")
			.select("*")
			.eq("follower", currentUser.toLowerCase())
			.eq("following", username.toLowerCase());
		if (followingRes.error) {
			console.error(followingRes.error);
			return false;
		} else {
			if (followingRes.data.length > 0) return true;
			return false;
		}
	} catch (err) {
		console.error(err);
		return false;
	}
};

export const unfollowUserInDb = async (username: string) => {
	const isFollowing = await checkFollowingInDb(username);
	const currentUser = await AsyncStorage.getItem("username");

	if (isFollowing) {
		if (!currentUser) return false;
		const followingRes = await supabaseClient
			.from<definitions["followers"]>("followers")
			.delete()
			.match({
				follower: currentUser.toLowerCase(),
				following: username.toLowerCase(),
			});

		if (followingRes.error) {
			console.error(followingRes.error);
			return false;
		} else {
			return true;
		}
	}
	return true;
};

export const followUserInDb = async (username: string) => {
	const isFollowing = await checkFollowingInDb(username);
	const currentUser = await AsyncStorage.getItem("username");

	if (!isFollowing) {
		if (!currentUser) return false;
		const followingRes = await supabaseClient
			.from<definitions["followers"]>("followers")

			.insert({
				follower: currentUser.toLowerCase(),
				following: username.toLowerCase(),
			});

		if (followingRes.error) {
			console.error(followingRes.error);
			return false;
		} else {
			return true;
		}
	}
	return true;
};
export const fetchFollowingFromDb = async (
	username: string
): Promise<Follower[] | null> => {
	if (!username || username.length === 0) return null;
	const followingRes = await supabaseClient
		.from<definitions["followers"]>("followers")
		.select("*")
		.eq("follower", username.toLowerCase());
	if (followingRes.error) {
		console.error(followingRes.error);
		return null;
	} else {
		return followingRes.data.map(
			(follower) =>
				({
					...follower,
				} as Follower)
		);
	}
};

export const fetchFollowersFromDb = async (
	username: string
): Promise<Follower[] | null> => {
	if (!username || username.length === 0) return null;
	const followingRes = await supabaseClient
		.from<definitions["followers"]>("followers")
		.select("*")
		.eq("following", username.toLowerCase());
	if (followingRes.error) {
		console.error(followingRes.error);
		return null;
	} else {
		return followingRes.data.map(
			(follower) =>
				({
					...follower,
				} as Follower)
		);
	}
};

export const fetchUserFromDb = async (
	username: string
): Promise<User | null> => {
	if (!username || username.length === 0) return null;
	const userExists = await supabaseClient
		.from<definitions["users"]>("users")
		.select("*")
		.eq("username", username.toLowerCase());
	if (userExists.error) {
		console.error(userExists.error);
		return null;
	}
	const user = userExists.data[0];
	if (!user) {
		console.error("User not found");
		return null;
	} else {
		const name = user.name;
		const bio = user.bio;
		if (name) {
			return {
				name,
				bio: bio || "",
				profilePic: user.profilePic,
				username,
			};
		} else {
			return null;
		}
	}
};

export const editUserInDb = async (username: string, newData: User) => {
	if (!username) return null;
	try {
		const res = await supabaseClient
			.from<definitions["users"]>("users")
			.update({
				...newData,
			})
			.match({
				username,
			});
		if (res.error || res.data.length === 0) {
			console.error(res.error);
			return false;
		}
		return res.data[0];
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const fetchCommentsFromDb = async (postId: number) => {
	if (!postId) return null;
	const allComments = await supabaseClient
		.from<definitions["comments"]>("comments")
		.select(
			`*, userData:users (
			username,
			name,
			bio,
			profilePic
		)`
		)
		.eq("postId", postId);

	if (allComments.error) {
		console.error(allComments.error);
		return null;
	}
	return allComments.data;
};

export const newCommentInDb = async (
	comment: Pick<definitions["comments"], "comment" | "postId" | "user">
): Promise<definitions["comments"] | null> => {
	try {
		const newComment = await supabaseClient
			.from<definitions["comments"] & { userData: definitions["users"] }>(
				"comments"
			)
			.insert(comment).select(`*, userData:users (
				username,
				name,
				bio,
				profilePic
			)`);

		if (newComment.error || newComment.data.length === 0) {
			console.error(newComment.error);
			return null;
		}
		UsersStore.addUser({
			bio: newComment.data[0].userData.bio,
			name: newComment.data[0].userData.name,
			profilePic: newComment.data[0].userData.profilePic,
			username: newComment.data[0].userData.username,
		});
		return {
			comment: newComment.data[0].comment,
			id: newComment.data[0].id,
			postId: newComment.data[0].postId,
			postedAt: newComment.data[0].postedAt,
			user: newComment.data[0].user,
		};
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const deleteCommentFromDb = async (commentId: number) => {
	if (!commentId) return false;
	try {
		const res = await supabaseClient
			.from<definitions["comments"]>("comments")
			.delete()
			.match({
				id: commentId,
			});
		if (res.error) {
			console.error(res.error);
			return false;
		}
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

export const newPostInDb = async (
	postData: Pick<definitions["posts"], "caption" | "imageUrl" | "user">
) => {
	try {
		const newPost = await supabaseClient
			.from<definitions["posts"]>("posts")
			.insert(postData);

		if (newPost.error || newPost.data.length === 0) {
			console.error(newPost.error);
			return null;
		}

		return newPost.data[0];
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const fetchPostsByUserFromDb = async (
	username: string
): Promise<Post[] | null> => {
	if (!username || username.length === 0) return null;
	const allPosts = await supabaseClient
		.from<definitions["posts"]>("posts")
		.select("*")
		.eq("user", username.toLowerCase());
	if (allPosts.error) {
		console.error(allPosts.error);
		return null;
	}
	const mappedPosts: Post[] = mapPosts(allPosts.data);
	return mappedPosts;
};

export const deletePostFromDb = async (postId: number) => {
	if (!postId) return false;
	try {
		const res = await supabaseClient
			.from<definitions["posts"]>("posts")
			.delete()
			.match({
				postId: postId,
			});
		if (res.error) {
			console.error(res.error);
			return false;
		}
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};
