import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StoryListType } from "../../types";

export type RootStackParamList = {
	Root: undefined;
	NotFound: undefined;
	ViewStory: {
		user: string;
		storyList: {
			[key: string]: StoryListType;
		} | null;
	};
};

export type ViewStoryNavigationProp = StackNavigationProp<
	RootStackParamList,
	"ViewStory"
>;

export type ViewStoryRouteProp = RouteProp<RootStackParamList, "ViewStory">;
