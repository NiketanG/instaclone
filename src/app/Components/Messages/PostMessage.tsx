import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { View } from "react-native";
import { TouchableHighlight, Image, useWindowDimensions } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { useQuery } from "react-query";
import { getPostById } from "../../../api";

import { MessageNoUsers } from "../../types";
import { MessageStackNavigationParams } from "../../types/navigation/MessagesStack";
import { AppContext } from "../../utils/appContext";
import { UserAvatar } from "../UserAvatar";

type Props = {
	message: MessageNoUsers;
	selectMessage: (username: string, messageId: number) => void;
};

type MessagesNavigationProp = StackNavigationProp<
	MessageStackNavigationParams,
	"Messages"
>;
const PostMessage: React.FC<Props> = ({ message, selectMessage }) => {
	const { user: currentUser } = useContext(AppContext);
	const { width } = useWindowDimensions();
	const { colors } = useTheme();

	const { data } = useQuery(
		`postInfo_${message.post?.postId}`,
		() => getPostById(message.post?.postId || null),
		{
			enabled:
				message.post?.postId !== null ||
				message.post?.postId !== undefined,
		}
	);
	const postWidth = width / 1.5;

	const navigation = useNavigation<MessagesNavigationProp>();

	const openPost = () => {
		if (!data) return;
		navigation.navigate("Post" as any, {
			screen: "Post",
			params: {
				post: data,
				user: data.user,
			},
		});
	};

	const viewProfile = () => {
		if (!data) return;
		navigation.navigate("Profile", data.user);
	};
	return (
		<TouchableHighlight
			onLongPress={() => selectMessage(message.sender, message.messageId)}
			key={message.messageId}
			onPress={openPost}
		>
			{currentUser && (
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent:
							message.sender === currentUser?.username
								? "flex-end"
								: "flex-start",
						marginHorizontal: 8,
						marginVertical: 4,
					}}
				>
					<Card
						style={{
							maxWidth: postWidth,
							backgroundColor: "#3a3a3a",
							borderRadius: 12,
						}}
					>
						<Card.Title
							title={data?.user?.username}
							left={() => (
								<UserAvatar
									profilePicture={data?.user.profilePic}
									onPress={viewProfile}
								/>
							)}
							titleStyle={{
								fontSize: 18,
								marginLeft: -16,
							}}
						/>
						<Image
							source={{ uri: data?.imageUrl }}
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
							<Text style={{ fontSize: 16 }}>
								{data?.user.username}
							</Text>
							{data?.caption ? (
								<Text
									style={{
										color: colors.placeholder,
									}}
								>
									{data.caption.substr(0, 10)}
								</Text>
							) : null}
						</Card.Content>
					</Card>
				</View>
			)}
		</TouchableHighlight>
	);
};

export default PostMessage;
