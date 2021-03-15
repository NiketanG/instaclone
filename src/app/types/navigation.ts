import { Post } from "../types";

export type SignInNavigationParams = {
	Login: undefined;
	Signup: undefined;
};

export type HomeStackNavigationParams = {
	Home: undefined;
	Comments: {
		post: Pick<Post, "caption" | "postedAt" | "postId">;
		user: {
			username: string;
			profilePic?: string | null;
		};
	};
};

export type ProfileStackParams = {
	ProfilePage: ProfilePageProps;
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

export interface UserProfile {
	username?: string;
	profilePic?: string;
	isCurrentUser?: boolean;
}

type ProfilePageProps = UserProfile;

export type ExploreStackNavigationParams = {
	Explore: undefined;
	PostDetail: {
		post: Pick<
			Post,
			"caption" | "postedAt" | "postId" | "imageUrl" | "likes"
		>;
		user: {
			username: string;
			profilePic?: string | null;
		};
	};
	ProfilePage: ProfilePageProps;
};

export type TabNavigationParams = {
	Home: undefined;
	Explore: undefined;
	Activity: undefined;
	New: undefined;
	Profile: undefined;
};
