import { Post } from "../store/PostsStore";
import { definitions } from "../types/supabase";

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
