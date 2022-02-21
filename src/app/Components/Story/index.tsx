import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StoryListType } from "../../types";
import { ViewStoryNavigationProp } from "../../types/navigation/RootStack";
import Entypo from "react-native-vector-icons/Entypo";
import { definitions } from "../../types/supabase";
import { AppContext } from "../../utils/appContext";
import { UserAvatar } from "../UserAvatar";
import { useTheme } from "react-native-paper";

type StoryProps = {
	isOwn?: boolean;
	user: Pick<definitions["users"], "name" | "profilePic" | "username">;

	stories: Array<
		Pick<definitions["stories"], "id" | "imageUrl" | "postedAt">
	>;
	openStory: (story: StoryListType, isOwn: boolean) => void;
};
const Story: React.FC<StoryProps> = ({
	isOwn,
	stories,
	user,
	openStory: openProfile,
}) => {
	const { colors } = useTheme();

	return (
		<TouchableOpacity
			onPress={() =>
				openProfile(
					{
						stories,
						user,
					},
					isOwn || false
				)
			}
			style={{
				display: "flex",
				alignItems: "center",
				marginHorizontal: 8,
			}}
		>
			<UserAvatar size={64} profilePicture={user?.profilePic} />
			{(isOwn && !stories) ||
				(stories.length === 0 && (
					<View
						style={{
							borderWidth: 2,
							position: "absolute",
							bottom: 20,
							borderRadius: 32,
							backgroundColor: "#03A9F4",
							padding: 2,
							right: 0,
							borderColor: colors.background,
						}}
					>
						<Entypo name="plus" size={14} color="white" />
					</View>
				))}
			<Text style={{ marginTop: 4, color: "white", fontSize: 12 }}>
				{isOwn
					? !stories || stories.length === 0
						? "Add Story"
						: "Your Story"
					: user?.name}
			</Text>
		</TouchableOpacity>
	);
};

type Props = {
	isLoading: boolean;
	stories:
		| {
				ownStories: null;
				stories: null;
		  }
		| {
				ownStories: {
					[key: string]: StoryListType;
				};
				stories: {
					[key: string]: StoryListType;
				};
		  }
		| undefined;
	error: unknown;
};
const Stories: React.FC<Props> = ({ stories, error }) => {
	const { user: currentUser } = useContext(AppContext);
	const navigation = useNavigation<ViewStoryNavigationProp>();

	const openStory = (story: StoryListType, isOwn = false) => {
		if (!stories || !currentUser) return;
		let storiesToView;
		if (isOwn) {
			if (
				stories?.ownStories &&
				Object.keys(stories.ownStories).length > 0
			) {
				storiesToView = stories.ownStories;
			} else {
				navigation.navigate("NewStory" as any);
				return;
			}
		} else {
			storiesToView = stories.stories;
		}
		navigation.navigate("ViewStory", {
			storyList: storiesToView,
			user: story.user.username,
		});
	};

	return (
		<ScrollView
			horizontal
			contentContainerStyle={{
				paddingHorizontal: 12,
			}}
		>
			{currentUser && (
				<Story
					stories={
						stories && stories.ownStories
							? stories.ownStories[currentUser.username]?.stories
							: []
					}
					user={currentUser}
					isOwn={true}
					openStory={openStory}
				/>
			)}
			{!error &&
				stories?.stories &&
				Object.keys(stories.stories).map((item) => (
					<Story
						key={item}
						stories={stories.stories[item].stories}
						user={stories.stories[item].user}
						openStory={openStory}
					/>
				))}
		</ScrollView>
	);
};

export default Stories;
