import { Follower } from "../../store/FollowersStore";
import { User } from "../../types";
import { definitions } from "../supabase";

export type ProfileStackParams = {
	Profile: Partial<User>;
	Followers: Pick<User, "username"> & {
		followers: Follower[];
	};
	Following: Pick<User, "username"> & {
		following: Follower[];
	};
	PostsList: {
		postId: number;
		postList: Array<definitions["posts"]>;
	};
	Settings: undefined;
	EditProfile: undefined;
};
