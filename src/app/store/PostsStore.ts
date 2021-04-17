import { Instance, SnapshotOut, types, flow } from "mobx-state-tree";
import { definitions } from "../types/supabase";
import {
	deletePostFromDb,
	fetchPostsByUserFromDb,
	newPostInDb,
} from "../utils/supabaseUtils";
import { uniqueList } from "../utils/utils";
import UsersStore from "./UsersStore";

export const PostModel = types
	.model("Post", {
		postId: types.identifierNumber,
		caption: types.maybe(types.string),
		imageUrl: types.string,
		postedAt: types.string,
		user: types.string,
	})
	.views((self) => ({
		get userData() {
			return UsersStore.getUser(self.user);
		},
	}));

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

		const newPost = flow(function* (
			postData: Pick<
				definitions["posts"],
				"caption" | "imageUrl" | "user"
			>
		) {
			const postRes = yield newPostInDb(postData);
			self.posts.push(postRes);
		});

		const deletePost = flow(function* (postId: number) {
			const postToDelete = self.posts.find(
				(post) => post.postId === postId
			);
			if (postToDelete) {
				// destroy(postToDelete);
				yield deletePostFromDb(postId);
				self.posts.replace(
					self.posts.filter((post) => post.postId !== postId)
				);
			}
		});

		const editPost = (postId: number, newData: Post) => {
			const postToEdit = self.posts.findIndex(
				(post) => post.postId === postId
			);
			if (postToEdit) Object.assign(self.posts[postToEdit], newData);
		};

		const fetchPostsByUser = flow(function* (username: string) {
			let postsByUser: Post[] =
				self.posts.filter((post) => post.user === username) || [];
			try {
				const fetchedPosts = yield fetchPostsByUserFromDb(username);
				if (fetchedPosts) {
					const tempArray = [...postsByUser, ...fetchedPosts];
					postsByUser = [
						...new Map(
							tempArray.map((item) => [item.postId, item])
						).values(),
					];
					self.posts.replace(
						uniqueList<Post>(self.posts, fetchedPosts, "postId")
					);
				}
			} catch (err) {
				console.error("[fetchPostsByUser]", err);
			}
			return postsByUser;
		});

		return {
			newPost,
			setPosts,
			addPost,
			deletePost,
			editPost,
			fetchPostsByUser,
		};
	})
	.views((self) => ({
		postsByUser(username: string): Post[] {
			return self.posts.filter((post) => post.user === username) || [];
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
