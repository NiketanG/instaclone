import firestore from "@react-native-firebase/firestore";
import { Post } from "../store/PostsStore";
import mapPosts from "./mapPosts";

export const fetchPostsByUserFromDb = async (
	username: string
): Promise<Post[]> => {
	if (!username || username.length === 0) return;
	const postsCollection = firestore().collection("posts");
	const allPosts = await postsCollection
		.where("username", "==", username.toLowerCase())
		.get();

	const mappedPosts: Post[] = mapPosts(allPosts);
	return mappedPosts;
};
