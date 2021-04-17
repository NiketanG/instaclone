import { Instance, SnapshotOut, types, flow } from "mobx-state-tree";
import { definitions } from "../types/supabase";
import {
	deleteCommentFromDb,
	fetchCommentsFromDb,
	newCommentInDb,
} from "../utils/supabaseUtils";
import { uniqueList } from "../utils/utils";
import PostsStore from "./PostsStore";
import UsersStore from "./UsersStore";

export const CommentModel = types
	.model("Comment", {
		id: types.identifierNumber,
		postId: types.number,
		user: types.string,
		postedAt: types.string,
		comment: types.string,
	})
	.views((self) => ({
		get post() {
			return PostsStore.posts.find((post) => post.postId === self.postId);
		},
		get userData() {
			return UsersStore.getUser(self.user);
		},
	}));

const CommentsStore = types
	.model("Comments", {
		comments: types.array(CommentModel),
	})
	.actions((self) => {
		const setComments = (comments: Array<Comment>) => {
			self.comments.replace(comments);
		};
		const addComment = flow(function* (
			comment: Pick<
				definitions["comments"],
				"comment" | "postId" | "user"
			>
		) {
			const newComment = yield newCommentInDb(comment);
			self.comments.push(newComment);
			return newComment;
		});

		const deleteComment = flow(function* (commentId: number) {
			const commentToDelete = self.comments.find(
				(comment) => comment.id === commentId
			);
			if (commentToDelete) {
				// destroy(postToDelete);
				yield deleteCommentFromDb(commentId);
				self.comments.replace(
					self.comments.filter((comment) => comment.id !== commentId)
				);
			}
		});

		const getComments = flow(function* (postId: number) {
			if (!postId) return null;

			let commentsOnPost: Comment[] =
				self.comments.filter((comment) => comment.postId === postId) ||
				[];
			try {
				const fetchedComments = yield fetchCommentsFromDb(postId);
				if (fetchedComments) {
					commentsOnPost = uniqueList<Comment>(
						commentsOnPost,
						fetchedComments,
						"id"
					);

					self.comments.replace(
						uniqueList<Comment>(
							self.comments,
							fetchedComments,
							"id"
						)
					);
				}
			} catch (err) {
				console.error("[getComments]", err);
			}
			return commentsOnPost;
		});

		return {
			setComments,
			addComment,
			deleteComment,
			getComments,
		};
	})
	.create({
		comments: [],
	});

type CommentType = Instance<typeof CommentModel>;
export interface Comment extends CommentType {}

type CommentSnapshotType = SnapshotOut<typeof CommentModel>;
export interface CommentSnapshot extends CommentSnapshotType {}

export default CommentsStore;
