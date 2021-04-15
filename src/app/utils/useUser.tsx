import { useEffect, useState } from "react";
import FollowersStore, { Follower } from "../store/FollowersStore";
import PostsStore from "../store/PostsStore";
import UsersStore from "../store/UsersStore";
import { definitions } from "../types/supabase";
import supabaseClient from "./supabaseClient";
import {
	fetchFollowersFromDb,
	fetchFollowingFromDb,
	fetchPostsByUserFromDb,
	fetchUserFromDb,
} from "./supabaseUtils";

const useUser = (username?: string | null) => {
	const [user, setUser] = useState<
		Pick<definitions["users"], "bio" | "name" | "profilePic" | "username">
	>();
	const [posts, setPosts] = useState<Array<definitions["posts"]>>([]);
	const [loading, setLoading] = useState(true);
	const [followers, setFollowers] = useState<Follower[]>([]);

	const [following, setFollowing] = useState<Follower[]>([]);

	const fetchUser = async (usernameToFetch: string) => {
		try {
			const userData = await fetchUserFromDb(usernameToFetch);
			const postsByUser = await fetchPostsByUserFromDb(usernameToFetch);
			const followerList = await fetchFollowersFromDb(usernameToFetch);
			const followingList = await fetchFollowingFromDb(usernameToFetch);
			return {
				user: userData,
				posts: postsByUser,
				followers: followerList,
				following: followingList,
			};
		} catch (err) {
			console.error(err);
			return {
				user: null,
				posts: null,
				followers: null,
				following: null,
			};
		}
	};

	useEffect(() => {
		if (username) {
			const fetchedUser = UsersStore.users.find(
				(userToFind) => userToFind.username === username
			);
			const usersPosts = PostsStore.posts
				.filter((post) => post.user === username)
				.sort(
					(a, b) =>
						new Date(b.postedAt).getTime() -
						new Date(a.postedAt).getTime()
				);

			const followingList = FollowersStore.followers.filter(
				(follower) => follower.follower === username
			);

			const followerList = FollowersStore.followers.filter(
				(follower) => follower.following === username
			);

			if (fetchedUser) setUser(fetchedUser);
			if (usersPosts) setPosts(usersPosts);
			setFollowers(followerList);
			setFollowing(followingList);
			setLoading(false);
		}
	}, [username]);

	useEffect(() => {
		if (username) {
			fetchUser(username).then((userData) => {
				if (userData) {
					if (userData.user) setUser(userData.user);
					if (userData.posts) setPosts(userData.posts);
					if (userData.followers) setFollowers(userData.followers);
					if (userData.following) setFollowing(userData.following);
					setLoading(false);
				}
			});
		}
	}, [username]);

	if (!username) {
		return {
			user: null,
			posts: null,
			followers: null,
			following: null,
			loading: false,
		};
	}

	return {
		user,
		posts,
		followers,
		following,
		loading,
	};
};

export default useUser;
