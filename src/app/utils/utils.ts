import PostsStore, { Post } from "../store/PostsStore";
import { fetchPostsByUserFromDb } from "./firebaseUtils";

export const removeDuplicatePosts = () => {
	PostsStore.setPosts([
		...new Map(
			PostsStore.posts.map((item) => [item.postId, item])
		).values(),
	]);
};

export const updatePostList = (newList: Post[]) => {
	const temp = [...PostsStore.posts, ...newList];
	PostsStore.setPosts([
		...new Map(temp.map((item) => [item.postId, item])).values(),
	]);
};
export const uniquePosts = (postList: Post[], newList: Post[]) => {
	const temp = [...postList, ...newList];
	return [...new Map(temp.map((item) => [item.postId, item])).values()];
};
