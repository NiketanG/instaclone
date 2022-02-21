import { useNavigation } from "@react-navigation/core";
import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import { View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Caption, Paragraph, Text } from "react-native-paper";
import { NestedComments } from "../../../api";
import { UserAvatar } from "../../Components/UserAvatar";
import { UserMin } from "../../types";
import { ProfileStackNavigationProp } from "../../types/navigation/ProfileStack";

export const CommentItem: React.FC<{
	item: NestedComments;
	selectComment: (username: string, commentId: number) => void;
	selectedComment: number | null;
	onReply: (item: NestedComments | null) => void;
}> = ({ item, selectComment, selectedComment, onReply }) => {
	const navigation = useNavigation<ProfileStackNavigationProp>();

	const viewProfile = (user: UserMin) => {
		navigation.navigate("Profile", user);
	};

	const onSelect = () => {
		selectComment(item.user.username, item.id);
	};

	const selectReply = () => {
		if (item.parent) {
			onReply(item.parent);
		} else {
			onReply(item);
		}
	};

	return (
		<TouchableHighlight onLongPress={onSelect} key={item.id}>
			<>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						padding: 16,
						paddingLeft: item.parent ? 48 : 16,
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
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Caption>
								{new Date(item.postedAt).getTime() >
								new Date().getTime() - 1 * 24 * 60 * 60 * 1000
									? `${formatDistanceToNow(
											new Date(item.postedAt)
									  )} ago`
									: format(
											new Date(item.postedAt),
											"LLLL dd, yyyy"
									  )}
							</Caption>
							<Caption
								style={{ marginLeft: 12 }}
								onPress={selectReply}
							>
								Reply
							</Caption>
						</View>
					</View>
				</View>
				{item.replies && item.replies?.length > 0
					? item.replies.map((comment) => (
							<CommentItem
								item={comment}
								onReply={onReply}
								selectComment={selectComment}
								selectedComment={selectedComment}
							/>
					  ))
					: null}
			</>
		</TouchableHighlight>
	);
};
