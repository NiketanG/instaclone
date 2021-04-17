import { Post } from "../store/PostsStore";
import { Follower } from "../store/FollowersStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { User } from "../store/UsersStore";
import { definitions } from "./supabase";
export type SignInNavigationParams = {
	Login: undefined;
	Signup: {
		name: string | null;
		email: string;
		profilePic: string | null;
	};
};

export type CommentsPageParams = {
	post: Post;
	user: User;
};
export type HomeStackNavigationParams = {
	Home: undefined;
	Comments: CommentsPageParams;
	Profile: StackNavigationProp<ProfileStackParams, "ProfilePage">;
};

export type ProfileStackParams = {
	ProfilePage: ProfilePageProps;
	Followers: ProfilePageProps & {
		followers: Follower[];
	};
	Following: ProfilePageProps & {
		following: Follower[];
	};
	Posts: PostListParams;
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
		post: Pick<Post, "caption" | "postedAt" | "postId" | "imageUrl">;
		user: {
			username: string;
			profilePic: string | null;
		};
	};
	Comments: CommentsPageParams;
	Profile: ProfilePageProps & {
		goBack: () => void;
	};
};
export type PostListParams = {
	goBack: () => void;
	user: {
		username: string;
		profilePic: string | undefined;
	};
	postId: number;
	postList: Array<definitions["posts"]>;
	rootNavigation: StackNavigationProp<ProfileStackParams, "ProfilePage">;
};
export type PostStackNavigationParams = {
	PostList: PostListParams;
	Comments: CommentsPageParams;
	Profile: StackNavigationProp<ProfileStackParams, "ProfilePage">;
};

export type TabNavigationParams = {
	Home: undefined;
	Explore: undefined;
	// Activity: undefined;
	New: undefined;
	Profile: undefined;
};
