import React, { useContext } from "react";
import {
	TouchableHighlight,
	View,
	Image,
	useWindowDimensions,
	Text,
} from "react-native";
import { Caption } from "react-native-paper";
import { useQuery } from "react-query";
import { getStoryById } from "../../../api";
import { MessageNoUsers } from "../../types";
import { AppContext } from "../../utils/appContext";

type Props = {
	message: MessageNoUsers;
	selectMessage: (username: string, messageId: number) => void;
	openStory: () => void;
};
const StoryMessage: React.FC<Props> = ({
	message,
	selectMessage,
	openStory,
}) => {
	const { user: currentUser } = useContext(AppContext);
	const { width } = useWindowDimensions();

	const { data, isLoading } = useQuery(
		`story_${message.storyId}`,
		() => getStoryById(message.storyId),
		{
			enabled: message.storyId !== null || message.storyId !== undefined,
		}
	);

	return (
		<TouchableHighlight
			onLongPress={() => selectMessage(message.sender, message.messageId)}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent:
						message.sender === currentUser?.username
							? "flex-end"
							: "flex-start",
				}}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "column",
						marginHorizontal: 8,
						alignItems:
							message.sender === currentUser?.username
								? "flex-end"
								: "flex-start",
					}}
				>
					{isLoading && (
						<View
							style={{
								width: 96,
								height: 128,
								borderRadius: 12,
								backgroundColor: "#3a3a3a",
							}}
						/>
					)}
					{data && (
						<TouchableHighlight
							onPress={openStory}
							style={{
								borderRadius: 12,
								marginHorizontal: 8,
								marginVertical: 4,
							}}
						>
							<Image
								source={{
									uri: data?.imageUrl,
								}}
								style={{
									width: 96,
									height: 128,
									borderRadius: 12,
									backgroundColor: "#3d3d3d",
								}}
							/>
						</TouchableHighlight>
					)}
					{message.text && message.text.length > 0 && (
						<Text
							style={{
								minHeight: 40,
								maxWidth: width / 2 - 16,
								textAlignVertical: "center",
								paddingHorizontal: 16,
								backgroundColor: "#3a3a3a",
								marginVertical: 4,
								marginHorizontal: 0,
								borderRadius: 24,
								color: "white",
								paddingVertical: 12,
							}}
						>
							{message.text}
						</Text>
					)}
					{data && (
						<Caption>
							{message.message_type === "STORYREPLY"
								? `${
										message.sender === currentUser?.username
											? "You replied"
											: "Replied"
								  } to ${
										data.user.username ===
										currentUser?.username
											? "your"
											: `${data.user.username}'s`
								  } story`
								: `${
										message.sender === currentUser?.username
											? "You sent"
											: "Sent"
								  } ${
										data.user.username ===
										currentUser?.username
											? "your"
											: `${data.user.username}'s`
								  } story`}
						</Caption>
					)}
				</View>
			</View>
		</TouchableHighlight>
	);
};

export default StoryMessage;
