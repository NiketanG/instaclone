import { StackNavigationProp } from "@react-navigation/stack";
import { LikeFull, PostFull, User } from "../../types";
import { definitions } from "../supabase";

export type PostStackParamsList = {
	Feed: undefined;
	Comments: {
		post: Pick<
			definitions["posts"],
			"postId" | "caption" | "user" | "postedAt"
		>;
		user: Partial<User>;
	};

	Likes: {
		likes: LikeFull[];
	};
	Post: {
		post: PostFull;
		user: definitions["users"];
	};

	PostsList: {
		postId: number;
		postList: Array<definitions["posts"]>;
	};
	EditPost: definitions["posts"];

	Profile: Partial<User>;
};

export type FeedNavigationProp = StackNavigationProp<
	PostStackParamsList,
	"Feed"
>;
