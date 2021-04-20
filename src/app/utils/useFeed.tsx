import { useCallback, useContext, useEffect, useState } from "react";
import FollowersStore from "../store/FollowersStore";
import PostsStore, { Post } from "../store/PostsStore";
import { definitions } from "../types/supabase";
import { AppContext } from "./appContext";
import supabaseClient from "./supabaseClient";
import { fetchFollowingFromDb } from "./supabaseUtils";
import mapPosts, { uniqueList } from "./utils";

type FeedPosts = {
	loading: boolean;
	posts: Post[];
	fetchFeed: () => void;
};
const useFeed = (): FeedPosts => {
	const [posts, setPosts] = useState<Array<Post>>([]);
	const [loading, setLoading] = useState(true);

	const { username: currentUser } = useContext(AppContext);

	const fetchFeedData = async (): Promise<Pick<FeedPosts, "posts">> => {
		if (!currentUser) {
			return {
				posts: [],
			};
		}
		let tempPosts: Post[] = [];

		try {
			const followingList = await fetchFollowingFromDb(currentUser);
			if (followingList) {
				const usersList = followingList.map((user) => user.following);
				const feedPosts = await supabaseClient
					.from<definitions["posts"]>("posts")
					.select("*")
					.in("user", usersList);
				if (feedPosts.error) {
					console.error("[fetchFeedPostsFromDb]", feedPosts.error);
					return {
						posts: [],
					};
				}
				tempPosts = mapPosts(feedPosts.data);

				const ownPosts = await supabaseClient
					.from<definitions["posts"]>("posts")
					.select("*")
					.eq("user", currentUser);

				let mappedOwnPosts: Post[] = [];
				if (ownPosts.error)
					console.error("[fetchOwnPostsFromDb]", ownPosts.error);
				if (ownPosts.data) mappedOwnPosts = mapPosts(ownPosts.data);
				tempPosts = [...tempPosts, ...mappedOwnPosts];

				PostsStore.setPosts(
					uniqueList<Post>(PostsStore.posts, tempPosts, "postId")
				);
			}
		} catch (err) {
			console.error("[fetchFeedData]", err);
		} finally {
			setLoading(false);
			return {
				posts: tempPosts,
			};
		}
	};

	useEffect(() => {
		if (currentUser) {
			const followingList = FollowersStore.followers.filter(
				(follower) => follower.follower === currentUser
			);
			let tempPosts: Post[] = [];

			if (followingList) {
				const usernamesList = followingList.map(
					(user) => user.following
				);
				const feedPosts = PostsStore.posts
					.filter((post) => usernamesList.includes(post.user))
					.sort(
						(a, b) =>
							new Date(b.postedAt).getTime() -
							new Date(a.postedAt).getTime()
					);
				tempPosts = feedPosts;

				const ownPosts = PostsStore.posts
					.filter((post) => post.user === currentUser)
					.sort(
						(a, b) =>
							new Date(b.postedAt).getTime() -
							new Date(a.postedAt).getTime()
					);
				tempPosts = [...feedPosts, ...ownPosts];
				setPosts(tempPosts);
			}
		}
	}, [currentUser]);

	const fetchFeed = useCallback(async () => {
		try {
			const feedPostsData = await fetchFeedData();
			if (feedPostsData.posts) {
				setPosts(feedPostsData.posts);
				PostsStore.setPosts(
					uniqueList<Post>(
						PostsStore.posts,
						feedPostsData.posts,
						"postId"
					)
				);
			}
		} catch (err) {
			console.error("[fetchFeed]", err);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	useEffect(() => {
		fetchFeed();
	}, [currentUser, fetchFeed]);

	if (!currentUser) {
		return {
			posts: [],
			loading: false,
			fetchFeed,
		};
	}

	return {
		posts,
		loading,
		fetchFeed,
	};
};

export default useFeed;
