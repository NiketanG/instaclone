import { Instance, SnapshotOut, types, flow } from "mobx-state-tree";
import {
	fetchFollowersFromDb,
	fetchFollowingFromDb,
} from "../utils/firebaseUtils";

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
			self.followers.replace(followers);
		};
		const followUser = (username: string, currentUsername: string) => {
			self.followers.push({
				follower: currentUsername,
				following: username,
			});
		};

		const unfollowUser = (username: string) => {
			self.followers.replace(
				self.followers.filter(
					(follower) => follower.following !== username
				)
			);
		};

		const getFollowers = flow(function* (username: string) {
			if (!username || username.length === 0) return null;

			let followers: Follower[] =
				self.followers.filter(
					(follower) => follower.following === username
				) || [];
			try {
				const fetchedFollowers:
					| Follower[]
					| null = yield fetchFollowersFromDb(username);
				if (fetchedFollowers) {
					const tempArray = [...followers, ...fetchedFollowers];

					followers = [
						...new Map(
							tempArray.map((item) => [item.follower, item])
						).values(),
					];
				}
			} catch (err) {
				console.log(err);
			}
			return followers;
		});

		const getFollowing = flow(function* (username: string) {
			if (!username || username.length === 0) return null;

			let following: Follower[] =
				self.followers.filter(
					(follower) => follower.follower === username
				) || [];
			try {
				const fetchedFollowing:
					| Follower[]
					| null = yield fetchFollowingFromDb(username);
				if (fetchedFollowing) {
					const tempArray = [...following, ...fetchedFollowing];

					following = [
						...new Map(
							tempArray.map((item) => [item.following, item])
						).values(),
					];
				}
			} catch (err) {
				console.log(err);
			}
			return following;
		});

		return {
			setFollowers,
			followUser,
			unfollowUser,
			getFollowers,
			getFollowing,
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
