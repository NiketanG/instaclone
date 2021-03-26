import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { Post } from "../types";
import UsersStore from "./UsersStore";

export const PostModel = types
	.model("Post", {
		caption: types.string,
		imageUrl: types.string,
		likes: types.number,
		postId: types.identifier,
		postedAt: types.string,
		username: types.string,
	})
	.views((self) => ({
		get postUser() {
			return UsersStore.getUser(self.username);
		},
	}));

const PostsStore = types
	.model("Posts", {
		posts: types.array(PostModel),
	})
	.actions((self) => ({
		setPosts(posts: Array<Post>) {
			self.posts.replace(posts);
		},
		addPost(post: Post) {
			self.posts.push(post);
		},
		deletePost(postId: string) {
			const postToDelete = self.posts.find(
				(post) => post.postId === postId
			);
			if (postToDelete) {
				// destroy(postToDelete);
				self.posts.remove(postToDelete);
			}
		},
		editPost(postId: string, newData: Post) {
			const postToEdit = self.posts.findIndex(
				(post) => post.postId === postId
			);
			if (postToEdit) Object.assign(self.posts[postToEdit], newData);
		},
	}))
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
