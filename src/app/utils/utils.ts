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

export const fetchPostByUser = async (username: string): Promise<Post[]> => {
	let postsByUser: Post[] = PostsStore.postsByUser(username);
	try {
		const fetchedPosts = await fetchPostsByUserFromDb(username);
		if (fetchedPosts) {
			const tempArray = [...postsByUser, ...fetchedPosts];
			postsByUser = [
				...new Map(
					tempArray.map((item) => [item.postId, item])
				).values(),
			];
		}
	} catch (err) {
		console.error(err);
	}

	return postsByUser;
};
