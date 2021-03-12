import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Post } from "../types";

const mapPosts = (
	allPosts: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
) => {
	return allPosts.docs.map(
		(post) =>
			({
				...post.data(),
				postId: post.id,
				postedAt: (post.get(
					"postedAt"
				) as FirebaseFirestoreTypes.Timestamp).toDate(),
			} as Post)
	);
};
export default mapPosts;
