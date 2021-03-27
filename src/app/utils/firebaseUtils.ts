import firestore from "@react-native-firebase/firestore";
import { Post } from "../store/PostsStore";
import mapPosts from "./mapPosts";
const postsCollection = firestore().collection("posts");

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
