import { Instance, SnapshotOut, types, flow } from "mobx-state-tree";
import {
	deletePostFromDb,
	fetchPostsByUserFromDb,
} from "../utils/firebaseUtils";
import { uniquePosts } from "../utils/utils";

export const PostModel = types.model("Post", {
	caption: types.string,
	imageUrl: types.string,
	likes: types.number,
	postId: types.identifier,
	postedAt: types.string,
	username: types.string,
});

const PostsStore = types
	.model("Posts", {
		posts: types.array(PostModel),
	})
	.actions((self) => {
		const setPosts = (posts: Array<Post>) => {
			self.posts.replace(posts);
		};
		const addPost = (post: Post) => {
			self.posts.push(post);
		};

		const deletePost = flow(function* (postId: string) {
			const postToDelete = self.posts.find(
				(post) => post.postId === postId
			);
			if (postToDelete) {
				console.log(postToDelete);
				// destroy(postToDelete);
				yield deletePostFromDb(postId);
				self.posts.replace(
					self.posts.filter((post) => post.postId !== postId)
				);
				console.log(self.posts);
			}
		});

		const editPost = (postId: string, newData: Post) => {
			const postToEdit = self.posts.findIndex(
				(post) => post.postId === postId
			);
			if (postToEdit) Object.assign(self.posts[postToEdit], newData);
		};

		const fetchPostsByUser = flow(function* (username: string) {
			let postsByUser: Post[] =
				self.posts.filter((post) => post.username === username) || [];
			try {
				const fetchedPosts = yield fetchPostsByUserFromDb(username);
				if (fetchedPosts) {
					const tempArray = [...postsByUser, ...fetchedPosts];
					postsByUser = [
						...new Map(
							tempArray.map((item) => [item.postId, item])
						).values(),
					];
					self.posts.replace(uniquePosts(self.posts, fetchedPosts));
				}
			} catch (err) {
				console.error(err);
			}
			return postsByUser;
		});

		return {
			setPosts,
			addPost,
			deletePost,
			editPost,
			fetchPostsByUser,
		};
	})
	.views((self) => ({
		postsByUser(username: string): Post[] {
			return (
				self.posts.filter((post) => post.username === username) || []
			);
		},
	}))
	.create({
		posts: [],
	});

type PostType = Instance<typeof PostModel>;
export interface Post extends PostType {}

type PostSnapshotType = SnapshotOut<typeof PostModel>;
export interface PostSnapshot extends PostSnapshotType {}

export default PostsStore;
