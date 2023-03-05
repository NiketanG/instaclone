import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { StoryListType, StoryViews, UserMin } from "../../types";
import { definitions } from "../supabase";

export type RootStackParamList = {
	Root: undefined;
	NotFound: undefined;
	ViewStory: {
		user: string;
		storyList: {
			[key: string]: StoryListType;
		} | null;
	};
	PostShareMenu: {
		postId?: number;
		type: "POST" | "STORY";
		storyId?: number;
	};
	StorySheet: {
		story: definitions["stories"];
		views: StoryViews[];
	};
	PostMenu: { postId: number; user: UserMin };
};
export type ViewStoryNavigationProp = StackNavigationProp<
	RootStackParamList,
	"ViewStory"
>;

export type ViewStoryRouteProp = RouteProp<RootStackParamList, "ViewStory">;

export type RootStackNavProps<Screen extends keyof RootStackParamList> =
	StackScreenProps<RootStackParamList, Screen>;
