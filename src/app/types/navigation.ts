import { Post } from "../types";

export interface UserProfileStackParams {
	ProfilePage: undefined;
	Followers: undefined;
	Following: undefined;
	Posts: undefined;
}

export type ProfileStackParams = {
	ProfilePage: undefined;
	Followers: undefined;
	Following: undefined;
	Posts: {
		user: {
			username: string;
			profilePic: string | null;
		};
		postId?: string;
		postList: Array<Post>;
	};
	Settings: undefined;
	EditProfile: undefined;
};

export type SignInNavigationParams = {
	Login: undefined;
	Signup: undefined;
};

export type TabNavigationParams = {
	Home: undefined;
	Explore: undefined;
	Activity: undefined;
	New: undefined;

	Profile: undefined;
};
