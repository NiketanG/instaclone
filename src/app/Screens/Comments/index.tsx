import React, { useContext, useEffect, useState } from "react";
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

import { AppContext } from "../../utils/authContext";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PostStackNavigationParams } from "../../types/navigation";
import { FlatList } from "react-native-gesture-handler";
import { UserAvatar } from "../../Components/UserAvatar";
import CommentsStore, { Comment } from "../../store/CommentsStore";
import { observer } from "mobx-react-lite";
import { CommentItem } from "./CommentItem";

type Props = {
	route: RouteProp<PostStackNavigationParams, "Comments">;
	navigation: StackNavigationProp<PostStackNavigationParams, "Comments">;
};

const Comments: React.FC<Props> = observer(({ route, navigation }) => {
	const { colors } = useTheme();
	const [comments, setComments] = useState<Array<Comment>>([]);
	const [loading, setLoading] = useState(true);

	const fetchComments = async () => {
		try {
			setComments(
				(await CommentsStore.getComments(route.params.post.postId)) ||
					[]
			);
		} catch (err) {
			console.error("[fetchComments]", err);
			ToastAndroid.show("Error retrieving posts", ToastAndroid.LONG);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (route.params?.post?.postId) fetchComments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [route.params.post]);

	const { username: currentUsername } = useContext(AppContext);

	const [commentText, setCommentText] = useState("");
	const addComment = async () => {
		if (
			commentText.length === 0 ||
			!currentUsername ||
			!route.params.post.postId
		)
			return;
		try {
			const newComment = await CommentsStore.addComment({
				comment: commentText,
				postId: route.params.post.postId,
				user: currentUsername,
			});

			const tempComments = [...comments];
			tempComments.push(newComment);
			setComments(tempComments);

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

	const deleteComment = async () => {
		if (selectedComment) {
			await CommentsStore.deleteComment(selectedComment);
			setSelectedComment(null);
			const tempComments = comments.filter(
				(comment) => comment.id !== selectedComment
			);
			setComments(tempComments);
		}
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
						<Appbar.Action icon="delete" onPress={deleteComment} />
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
								onRefresh={fetchComments}
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
					onSubmitEditing={addComment}
					style={{
						flexGrow: 1,
						backgroundColor: "#2f2f2f",
						color: "white",
					}}
				/>
				<IconButton
					onPress={addComment}
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
