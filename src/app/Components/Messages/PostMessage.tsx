import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { TouchableHighlight, Image, useWindowDimensions } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

import { Message } from "../../store/MessagesStore";
import { MessageStackNavigationParams } from "../../types/navigation";
import { AppContext } from "../../utils/appContext";
import usePostData from "../../utils/usePostData";
import { UserAvatar } from "../UserAvatar";

type Props = {
	message: Message;
	selectMessage: (username: string, messageId: number) => void;
};

type MessagesNavigationProp = StackNavigationProp<
	MessageStackNavigationParams,
	"Messages"
>;
const PostMessage: React.FC<Props> = ({ message, selectMessage }) => {
	const { username: currentUser } = useContext(AppContext);
	const { width } = useWindowDimensions();
	const { colors } = useTheme();

	const { post, user } = usePostData(message.postId);
	const postWidth = width / 1.5;

	const navigation = useNavigation<MessagesNavigationProp>();

	const goBack = () => navigation.goBack();

	const openPost = () => {
		if (!post) return;
		navigation.navigate("Post", {
			post: {
				caption: post?.caption,
				imageUrl: post?.imageUrl,
				postId: post?.postId,
				postedAt: post?.postedAt,
			},
			user: {
				profilePic: user?.profilePic,
				username: post.user,
			},
		});
	};

	const viewProfile = () => {
		if (!post) return;
		navigation.navigate("Profile", {
			username: post?.user,
			profilePic: user?.profilePic,
			showBackArrow: true,
			goBack,
		});
	};
	return (
		<TouchableHighlight
			onLongPress={() => selectMessage(message.sender, message.messageId)}
			key={message.messageId}
			onPress={openPost}
		>
			<Card
				style={{
					display: "flex",
					maxWidth: postWidth,
					backgroundColor: "#3a3a3a",
					marginHorizontal: 8,
					marginVertical: 4,
					borderRadius: 12,
					flexDirection: "row",
					justifyContent:
						message.sender === currentUser
							? "flex-end"
							: "flex-start",
				}}
			>
				<Card.Title
					title={post?.user}
					left={() => (
						<UserAvatar
							profilePicture={user?.profilePic}
							onPress={viewProfile}
						/>
					)}
					titleStyle={{
						fontSize: 18,
						marginLeft: -16,
					}}
				/>
				<Image
					source={{ uri: post?.imageUrl }}
					style={{
						width: postWidth,
						height: postWidth,
					}}
					width={postWidth}
					height={postWidth}
				/>
				<Card.Content
					style={{
						marginTop: 12,
					}}
				>
					<Text style={{ fontSize: 16 }}>{post?.user}</Text>
					{post?.caption ? (
						<Text
							style={{
								color: colors.placeholder,
							}}
						>
							{post.caption.substr(0, 10)}
						</Text>
					) : null}
				</Card.Content>
			</Card>
		</TouchableHighlight>
	);
};

export default PostMessage;
