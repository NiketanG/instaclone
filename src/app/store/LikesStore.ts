import { Instance, SnapshotOut, types, flow } from "mobx-state-tree";
import { getLikesFromDb } from "../utils/supabaseUtils";
import { uniqueList } from "../utils/utils";

// import { definitions } from "../types/supabase";
// import { unlikePostInDb } from "../utils/supabaseUtils";
// import PostsStore from "./PostsStore";
// import UsersStore from "./UsersStore";

export const LikeModel = types.model("Like", {
	id: types.identifierNumber,
	postId: types.number,
	user: types.string,
	// likedAt: types.string,
});
// .views((self) => ({
// 	get post() {
// 		return PostsStore.posts.find((post) => post.postId === self.postId);
// 	},
// 	get userData() {
// 		return UsersStore.getUser(self.user);
// 	},
// }));

const LikesStore = types
	.model("Likes", {
		likes: types.array(LikeModel),
	})
	.actions((self) => {
		const setLikes = (likes: Array<Like>) => {
			self.likes.replace(likes);
		};

		const addLike = (newLike: Like) => {
			if (
				!self.likes.find(
					(like) =>
						like.id === newLike.postId && like.user === newLike.user
				)
			)
				self.likes.push(newLike);
		};

		const deleteLike = (likeToDelete: Pick<Like, "postId" | "user">) => {
			self.likes.replace(
				self.likes.filter(
					(like) =>
						like.postId !== likeToDelete.postId &&
						like.user !== likeToDelete.user
				)
			);
		};

		const getLikes = flow(function* (postId: number) {
			if (!postId) return null;

			let likesOnPost: Like[] =
				self.likes.filter((like) => like.postId === postId) || [];
			try {
				const fetchedLikes = yield getLikesFromDb(postId);
				if (fetchedLikes) {
					likesOnPost = uniqueList<Like>(
						likesOnPost,
						fetchedLikes,
						"id"
					);

					self.likes.replace(
						uniqueList<Like>(self.likes, fetchedLikes, "id")
					);
				}
			} catch (err) {
				console.error("[getLikes]", err);
			}
			return likesOnPost;
		});

		return {
			setLikes,
			addLike,
			deleteLike,
			getLikes,
		};
	})
	.create({
		likes: [],
	});

type LikeType = Instance<typeof LikeModel>;
export interface Like extends LikeType {}

type LikeSnapshotType = SnapshotOut<typeof LikeModel>;
export interface LikeSnapshot extends LikeSnapshotType {}

export default LikesStore;
