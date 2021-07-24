import React from "react";
import { View } from "react-native";
import { Caption, Paragraph, Text } from "react-native-paper";
import { format, formatDistanceToNow } from "date-fns";
import { TouchableHighlight } from "react-native-gesture-handler";
import { UserAvatar } from "../../Components/UserAvatar";
import { useNavigation } from "@react-navigation/core";
import { CommentFull, UserMin } from "../../types";

export const CommentItem: React.FC<{
	item: CommentFull;
	selectComment: (username: string, commentId: number) => void;
	selectedComment: number | null;
}> = ({ item, selectComment, selectedComment }) => {
	const navigation = useNavigation();

	const viewProfile = (user: UserMin) => {
		navigation.navigate("Profile", user);
	};

	return (
		<TouchableHighlight
			onLongPress={() => {
				selectComment(item.user.username, item.id);
			}}
			key={item.id}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					padding: 16,
					backgroundColor:
						selectedComment === item.id ? "gray" : "black",
				}}
			>
				<UserAvatar onPress={() => viewProfile(item.user)} />
				<View
					style={{
						marginHorizontal: 16,
					}}
				>
					<Text
						onPress={() => viewProfile(item.user)}
						style={{
							fontSize: 16,
							fontWeight: "bold",
						}}
					>
						{item.user.username}
					</Text>
					<Paragraph>{item.comment}</Paragraph>
					<Caption>
						{new Date(item.postedAt).getTime() >
						new Date().getTime() - 1 * 24 * 60 * 60 * 1000
							? `${formatDistanceToNow(
									new Date(item.postedAt)
							  )} ago`
							: format(new Date(item.postedAt), "LLLL dd, yyyy")}
					</Caption>
				</View>
			</View>
		</TouchableHighlight>
	);
};
