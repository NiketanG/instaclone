import React, { useContext, useState } from "react";
import { RefreshControl, StatusBar, ToastAndroid, View } from "react-native";
import {
	Appbar,
	Caption,
	Divider,
	IconButton,
	Paragraph,
	Text,
	useTheme,
	TextInput,
} from "react-native-paper";
import { format, formatDistanceToNow } from "date-fns";

import { AppContext } from "../../utils/appContext";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PostStackNavigationParams } from "../../types/navigation";
import { FlatList } from "react-native-gesture-handler";
import { UserAvatar } from "../../Components/UserAvatar";
import { observer } from "mobx-react-lite";
import { CommentItem } from "./CommentItem";
import usePost from "../../utils/usePost";

type Props = {
	route: RouteProp<PostStackNavigationParams, "Comments">;
	navigation: StackNavigationProp<PostStackNavigationParams, "Comments">;
};

const Comments: React.FC<Props> = observer(({ route, navigation }) => {
	const { colors } = useTheme();
	const { username: currentUsername } = useContext(AppContext);

	const [commentText, setCommentText] = useState("");

	const { comments, addComment, deleteComment, loading } = usePost(
		route.params.post.postId
	);

	const newComment = () => {
		if (
			commentText.length === 0 ||
			!route.params.post.postId ||
			!currentUsername
		)
			return;
		try {
			addComment({
				comment: commentText,
				postId: route.params.post.postId,
				user: currentUsername,
			});
			setCommentText("");
		} catch (err) {
			console.error("[addComment]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};

	const [selectedComment, setSelectedComment] = useState<number | null>(null);

	const selectComment = (username: string, commentId: number) => {
		if (username === currentUsername) setSelectedComment(commentId);
	};

	const goBack = () => {
		if (selectedComment) {
			setSelectedComment(null);
		} else {
			navigation.goBack();
		}
	};

	const removeComment = () => {
		if (selectedComment) deleteComment(selectedComment);
		setSelectedComment(null);
	};

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<View
				style={{
					backgroundColor: colors.surface,
					flex: 1,
				}}
			>
				<StatusBar
					backgroundColor="black"
					barStyle="light-content"
					animated
				/>
				<Appbar.Header
					style={{
						backgroundColor: selectedComment ? "#009688" : "black",
					}}
				>
					<Appbar.BackAction onPress={goBack} />
					<Appbar.Content title="Comments" />
					{selectedComment && (
						<Appbar.Action icon="delete" onPress={removeComment} />
					)}
				</Appbar.Header>

				{
					<FlatList
						ListHeaderComponent={
							<>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										margin: 16,
									}}
								>
									<UserAvatar
										profilePicture={
											route.params?.user?.profilePic
										}
									/>
									<View
										style={{
											marginHorizontal: 16,
										}}
									>
										<Text
											style={{
												fontSize: 16,
												fontWeight: "bold",
											}}
										>
											{route.params?.user?.username}
										</Text>
										<Paragraph>
											{route.params?.post?.caption}
										</Paragraph>
										<Caption>
											{new Date(
												route.params?.post?.postedAt
											).getTime() >
											new Date().getTime() -
												1 * 24 * 60 * 60 * 1000
												? `${formatDistanceToNow(
														new Date(
															route.params?.post?.postedAt
														)
												  )} ago`
												: format(
														new Date(
															route.params?.post?.postedAt
														),
														"LLLL dd, yyyy"
												  )}
										</Caption>
									</View>
								</View>
								<Divider />
							</>
						}
						data={comments?.sort(
							(a, b) =>
								new Date(b.postedAt).getTime() -
								new Date(a.postedAt).getTime()
						)}
						refreshControl={
							<RefreshControl
								refreshing={loading}
								onRefresh={newComment}
							/>
						}
						ItemSeparatorComponent={Divider}
						renderItem={({ item }) => (
							<CommentItem
								item={item}
								selectComment={selectComment}
								selectedComment={selectedComment}
							/>
						)}
						keyExtractor={(item) => item.id}
						bouncesZoom
						bounces
						snapToAlignment={"start"}
						showsVerticalScrollIndicator
						style={{
							backgroundColor: colors.background,
						}}
					/>
				}
			</View>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					backgroundColor: "#2f2f2f",
					alignItems: "center",
				}}
			>
				<TextInput
					value={commentText}
					onChangeText={(text) => setCommentText(text)}
					placeholder="Add a comment"
					onSubmitEditing={newComment}
					style={{
						flexGrow: 1,
						backgroundColor: "#2f2f2f",
						color: "white",
					}}
				/>
				<IconButton
					onPress={newComment}
					icon="send"
					style={{
						backgroundColor: "transparent",
					}}
				/>
			</View>
		</View>
	);
});

export default Comments;
