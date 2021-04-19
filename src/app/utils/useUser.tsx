import { useContext, useEffect, useState } from "react";
import FollowersStore, { Follower } from "../store/FollowersStore";
import PostsStore, { Post } from "../store/PostsStore";
import UsersStore from "../store/UsersStore";
import { definitions } from "../types/supabase";
import { AppContext } from "./authContext";
import {
	checkFollowingInDb,
	fetchFollowersFromDb,
	fetchFollowingFromDb,
	fetchPostsByUserFromDb,
	fetchUserFromDb,
} from "./supabaseUtils";
import { uniqueList } from "./utils";

const useUser = (username?: string | null) => {
	const [user, setUser] = useState<
		Pick<definitions["users"], "bio" | "name" | "profilePic" | "username">
	>();
	const [posts, setPosts] = useState<Array<definitions["posts"]>>([]);
	const [loading, setLoading] = useState(true);
	const [followers, setFollowers] = useState<Follower[]>([]);
	const [following, setFollowing] = useState<Follower[]>([]);
	const [isFollowing, setIsFollowing] = useState(false);

	const { username: currentUser } = useContext(AppContext);

	const fetchUserData = async (usernameToFetch: string) => {
		try {
			const userData = await fetchUserFromDb(usernameToFetch);
			const postsByUser = await fetchPostsByUserFromDb(usernameToFetch);
			const followerList = await fetchFollowersFromDb(usernameToFetch);
			const followingList = await fetchFollowingFromDb(usernameToFetch);
			const isFollowingUser = await checkFollowingInDb(usernameToFetch);
			if (followerList) FollowersStore.setFollowers(followerList);
			if (followingList) FollowersStore.setFollowers(followingList);

			return {
				user: userData,
				posts: postsByUser,
				followers: followerList,
				following: followingList,
				isFollowing: isFollowingUser,
			};
		} catch (err) {
			console.error("[fetchUserData]", err);
			return {
				user: null,
				posts: null,
				followers: [],
				following: [],
				isFollowing: false,
			};
		}
	};

	useEffect(() => {
		if (username && currentUser) {
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

			const isFollowingUser = FollowersStore.followers.find(
				(follower) =>
					follower.follower === currentUser &&
					follower.following === username
			);

			if (fetchedUser) setUser(fetchedUser);

			if (usersPosts) setPosts(usersPosts);
			if (isFollowingUser) {
				setIsFollowing(true);
			} else {
				setIsFollowing(false);
			}
			setFollowers(followerList);
			setFollowing(followingList);

			setLoading(false);
		}
	}, [currentUser, username]);

	const fetchUser = async (usernameToFetch: string) => {
		fetchUserData(usernameToFetch).then((userData) => {
			if (userData) {
				if (userData.user) {
					setUser(userData.user);
					UsersStore.addUser(userData.user);
				}
				if (userData.posts) {
					setPosts(userData.posts);
					PostsStore.setPosts(
						uniqueList<Post>(
							PostsStore.posts,
							userData.posts,
							"postId"
						)
					);
				}

				if (userData.followers) {
					setFollowers(userData.followers);
				}
				if (userData.following) setFollowing(userData.following);
				if (userData.isFollowing) setIsFollowing(userData.isFollowing);
				setLoading(false);
			}
		});
	};

	const followUser = async () => {
		if (!(currentUser && username)) return;
		setIsFollowing(true);
		const isFollowingInStore = followers.find(
			(e) => e.follower === currentUser && e.following === username
		);
		const tempFollowers = followers;
		if (!isFollowingInStore) {
			tempFollowers.push({
				follower: currentUser,
				following: username,
			});
		}
		setFollowers(tempFollowers);

		FollowersStore.followUser(username, currentUser);
	};

	const unfollowUser = async () => {
		if (!(currentUser && username)) return;
		setIsFollowing(false);
		const tempFollowers = followers.filter(
			(follower) =>
				follower.following !== username &&
				follower.follower !== currentUser
		);
		setFollowers(tempFollowers);

		FollowersStore.unfollowUser(username, currentUser);
	};

	useEffect(() => {
		if (username) fetchUser(username);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);

	if (!username)
		return {
			user: null,
			posts: null,
			followers: null,
			following: null,
			loading: false,
			isFollowing: false,
			fetchUser,
			followUser,
			unfollowUser,
		};

	return {
		user,
		posts,
		followers,
		following,
		loading,
		isFollowing,
		fetchUser,
		followUser,
		unfollowUser,
	};
};

export default useUser;
