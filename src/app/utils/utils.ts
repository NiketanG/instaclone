import PostsStore, { Post } from "../store/PostsStore";
import { Comment } from "../store/CommentsStore";
import { definitions } from "../types/supabase";
import { Follower } from "../store/FollowersStore";

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

export const uniqueComments = (commentList: Comment[], newList: Comment[]) => {
	const temp = [...commentList, ...newList];
	return [...new Map(temp.map((item) => [item.id, item])).values()];
};

export const mapComments = (allComments: Comment[]) => {
	return allComments.map((comment) => ({
		...comment,
		postedAt: new Date(comment.postedAt).toISOString(),
	}));
};

const mapPosts = (allPosts: definitions["posts"][]) => {
	return allPosts.map(
		(post) =>
			({
				...post,
				postId: post.postId,
				postedAt: new Date(post.postedAt).toISOString(),
			} as Post)
	);
};
export default mapPosts;

export async function asyncForEach(
	array: any[],
	callback: (arg0: any, arg1: number, arg2: any[]) => void
) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

export const fetchFeedPosts = async (followingList: Follower[]) => {
	let feedPosts: Post[] = [];
	await asyncForEach(followingList, async (user) => {
		const posts = await PostsStore.fetchPostsByUser(user.following);
		feedPosts = posts;
	});
	updatePostList(feedPosts);
	return feedPosts;
};
