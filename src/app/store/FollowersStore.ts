import { Instance, SnapshotOut, types, flow } from "mobx-state-tree";
import {
	checkFollowingInDb,
	fetchFollowersFromDb,
	fetchFollowingFromDb,
	followUserInDb,
	unfollowUserInDb,
} from "../utils/supabaseUtils";

export const FollowerModel = types.model("Follower", {
	follower: types.string,
	following: types.string,
});

const FollowersStore = types
	.model("Followers", {
		followers: types.array(FollowerModel),
	})
	.actions((self) => {
		const setFollowers = (followers: Array<Follower>) => {
			followers.forEach((follower) => {
				const isFollowing = self.followers.find(
					(e) =>
						e.follower === follower.follower &&
						e.following === follower.following
				);
				if (!isFollowing) {
					self.followers.push(follower);
				}
			});
		};
		const followUser = flow(function* (
			username: string,
			currentUsername: string
		) {
			const isFollowing = self.followers.find(
				(e) =>
					e.follower === currentUsername && e.following === username
			);
			if (!isFollowing) {
				self.followers.push({
					follower: currentUsername,
					following: username,
				});
			}

			yield followUserInDb(username);
		});

		const unfollowUser = flow(function* (
			username: string,
			currentUsername: string
		) {
			self.followers.replace(
				self.followers.filter(
					(follower) =>
						follower.following !== username &&
						follower.follower !== currentUsername
				)
			);
			yield unfollowUserInDb(username);
		});

		return {
			setFollowers,
			followUser,
			unfollowUser,
		};
	})

	.create({
		followers: [],
	});

type FollowerType = Instance<typeof FollowerModel>;
export interface Follower extends FollowerType {}

type FollowerSnapshotType = SnapshotOut<typeof FollowerModel>;
export interface FollowerSnapshot extends FollowerSnapshotType {}

export default FollowersStore;
