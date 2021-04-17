import PostsStore, { Post } from "../store/PostsStore";
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

export function uniqueList<Model>(
	oldList: Model[],
	newList: Model[],
	key: keyof Model
) {
	const temp = [...oldList, ...newList];
	return [
		...new Map(temp.map((item) => [(item as any)[key], item])).values(),
	];
}

const mapPosts = (allPosts: definitions["posts"][]) => {
	return allPosts.map(
		(post) =>
			({
				...post,
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
