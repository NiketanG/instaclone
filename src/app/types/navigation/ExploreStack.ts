import { definitions } from "../supabase";

export type ExploreStackNavigationParams = {
	Explore: undefined;

	PostsList: {
		postId: number;
		postList: Array<definitions["posts"]>;
	};
};
