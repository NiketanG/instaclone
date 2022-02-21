import { StackNavigationProp } from "@react-navigation/stack";
import { FollowerFull, FollowingFull, PostWithUser, User } from "../../types";

export type ProfileStackParams = {
	Profile: Partial<User>;
	Followers: Pick<User, "username"> & {
		followers: FollowerFull[];
	};
	Following: Pick<User, "username"> & {
		following: FollowingFull[];
	};
	PostsList: {
		postId: number;
		postList: PostWithUser[];
	};
	Settings: undefined;
	EditProfile: undefined;
};

export type ProfileStackNavigationProp = StackNavigationProp<
	ProfileStackParams,
	"Profile"
>;
