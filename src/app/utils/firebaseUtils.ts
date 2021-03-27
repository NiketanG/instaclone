import firestore from "@react-native-firebase/firestore";
import { Follower } from "../store/FollowersStore";
import { Post } from "../store/PostsStore";
import { User } from "../store/UsersStore";
import mapPosts from "./mapPosts";

const followersCollection = firestore().collection("followers");
const postsCollection = firestore().collection("posts");
const usersCollection = firestore().collection("users");

export const fetchFollowingFromDb = async (
	username: string
): Promise<Follower[] | null> => {
	if (!username || username.length === 0) return null;
	const followingRes = await followersCollection
		.where("follower", "==", username)
		.get();

	return followingRes.docs.map(
		(follower) =>
			({
				...follower.data(),
			} as Follower)
	);
};

export const fetchFollowersFromDb = async (
	username: string
): Promise<Follower[] | null> => {
	if (!username || username.length === 0) return null;
	const followingRes = await followersCollection
		.where("following", "==", username)
		.get();

	return followingRes.docs.map(
		(follower) =>
			({
				...follower.data(),
			} as Follower)
	);
};

export const fetchUserFromDb = async (
	username: string
): Promise<User | null> => {
	if (!username || username.length === 0) return null;
	const userExists = await usersCollection
		.where("username", "==", username.toLowerCase())
		.get();

	const user = userExists.docs[0];
	if (!user) {
		console.error("User not found");
		return null;
	} else {
		const name = user.get("name")?.toString();
		const bio = user.get("bio")?.toString();
		if (name) {
			return {
				name,
				bio: bio || "",
				profilePic: user.get("profilePic")?.toString() || null,
				username,
			};
		} else {
			return null;
		}
	}
};

export const editUserInDb = async (userId: string, newData: User) => {
	await usersCollection.doc(userId).update({
		username: newData.username.toLowerCase(),
		name: newData.name,
		bio: newData.bio,
		profilePic: newData.profilePic || "",
	});
};
export const fetchPostsByUserFromDb = async (
	username: string
): Promise<Post[] | null> => {
	if (!username || username.length === 0) return null;
	const allPosts = await postsCollection
		.where("username", "==", username.toLowerCase())
		.get();

	const mappedPosts: Post[] = mapPosts(allPosts);
	return mappedPosts;
};

export const deletePostFromDb = async (postId: string) => {
	if (!postId) return null;
	await postsCollection.doc(postId).delete();
	return true;
};
