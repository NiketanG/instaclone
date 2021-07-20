import { StackNavigationProp } from "@react-navigation/stack";
import { User } from "../../types";
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

	Likes: Pick<definitions["posts"], "postId">;
	Post: {
		post: definitions["posts"];
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
