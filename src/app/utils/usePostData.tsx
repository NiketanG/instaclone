import { useEffect, useState } from "react";
import PostsStore, { Post } from "../store/PostsStore";
import UsersStore, { User } from "../store/UsersStore";
import { definitions } from "../types/supabase";
import supabaseClient from "./supabaseClient";

type ReturnType = {
	loading: boolean;
	post: Post | null;
	user: User | null;
	fetchPost: () => void;
};
const usePostData = (postId?: number): ReturnType => {
	const [loading, setLoading] = useState(true);
	const [post, setPost] = useState<Post | null>(null);
	const [user, setUser] = useState<User | null>(null);

	const fetchPostData = async () => {
		if (!postId)
			return {
				post: null,
				user: null,
			};

		try {
			let response: {
				post: Post | null;
				user: User | null;
			} = {
				post: null,
				user: null,
			};
			const postData = await supabaseClient
				.from<definitions["posts"]>("posts")
				.select(`*`)
				.eq("postId", postId);

			if (
				(postData.data && postData.data.length > 0) ||
				!postData.error
			) {
				response.post = {
					caption: postData.data[0].caption,
					imageUrl: postData.data[0].imageUrl,
					postId: postData.data[0].postId,
					postedAt: postData.data[0].postedAt,
					user: postData.data[0].user,
				};
			} else {
				console.error(
					`[fetchPostData_Response]
                            ${postData.error || "No Data"}`
				);
				return {
					post: null,
					user: null,
				};
			}

			const userData = await supabaseClient
				.from<definitions["users"]>("users")
				.select(`*`)
				.eq("username", postData.data[0].user);

			if (
				(userData.data && userData.data.length > 0) ||
				!userData.error
			) {
				response.user = {
					bio: userData.data[0].bio,
					name: userData.data[0].name,
					profilePic: userData.data[0].profilePic,
					username: userData.data[0].username,
				};
			} else {
				console.error(
					`[fetchPostData_Response]
                            ${userData.error || "No Data"}`
				);
				return {
					post: null,
					user: null,
				};
			}

			return response;
		} catch (err) {
			console.error("[fetchPostData]", err);
			return {
				post: null,
				user: null,
			};
		}
	};
	const fetchPost = async () => {
		const postData = await fetchPostData();
		if (postData?.post) setPost(postData.post);
		if (postData?.user) setUser(postData.user);
		setLoading(false);
	};

	useEffect(() => {
		if (postId) fetchPost();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId]);

	useEffect(() => {
		if (postId) {
			const postData = PostsStore.posts.find(
				(postToFind) => postToFind.postId === postId
			);

			if (postData) {
				setPost(postData);
				const userData = UsersStore.users.find(
					(userToFind) => userToFind.username === postData.user
				);

				if (userData) setUser(userData);
			}
		}
	}, [postId]);

	if (!postId)
		return {
			fetchPost,
			loading: false,
			post: null,
			user: null,
		};

	return {
		fetchPost,
		loading,
		post,
		user,
	};
};

export default usePostData;
