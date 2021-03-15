import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StatusBar, ToastAndroid, View } from "react-native";
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

import { Comment } from "../../types";
import firestore, {
	FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { AppContext } from "../../utils/authContext";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackNavigationParams } from "../../types/navigation";
import { TouchableHighlight } from "react-native-gesture-handler";
import { UserAvatar } from "../../Components/UserAvatar";

type Props = {
	route: RouteProp<HomeStackNavigationParams, "Comments">;
	navigation: StackNavigationProp<HomeStackNavigationParams, "Comments">;
};

const Comments: React.FC<Props> = ({ route, navigation }) => {
	const { colors } = useTheme();
	const [comments, setComments] = useState<Array<Comment> | null>(null);

	const commentsCollection = firestore().collection("comments");

	useEffect(() => {
		(async () => {
			if (!route.params?.post?.postId) return;
			const postRes = await commentsCollection
				.where("postId", "==", route.params?.post?.postId)
				.get();
			setComments(
				postRes.docs.map(
					(comment) =>
						({
							commentId: comment.id,
							comment: comment.get("comment"),
							postId: comment.get("postId"),
							username: comment.get("username"),
							profilePic: comment.get("profilePic"),
							postedAt: (comment.get(
								"postedAt"
							) as FirebaseFirestoreTypes.Timestamp)?.toDate(),
						} as Comment)
				)
			);
			if (postRes.docs.length === 0) {
				return;
			} else {
			}
		})();
	}, [commentsCollection, route.params.post]);

	const {
		username: currentUsername,
		profilePic: currentProfilePic,
	} = useContext(AppContext);

	const [commentText, setCommentText] = useState("");
	const addComment = async () => {
		if (commentText.length === 0) return;
		try {
			await commentsCollection.add({
				postId: route.params?.post?.postId,
				comment: commentText,
				username: currentUsername,
				profilePic: currentProfilePic,
				postedAt: firestore.FieldValue.serverTimestamp(),
			});
			setCommentText("");
		} catch (err) {
			console.error(err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};

	const [selectedComment, setSelectedComment] = useState<string | null>(null);

	const selectComment = (username: string, commentId: string) => {
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
			await commentsCollection.doc(selectedComment).delete();
			setSelectedComment(null);
		}
	};

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<ScrollView
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
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						margin: 16,
					}}
				>
					<UserAvatar
						profilePicture={route.params?.user?.profilePic}
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
						<Paragraph>{route.params?.post?.caption}</Paragraph>
						<Caption>
							{route.params?.post?.postedAt?.toLocaleString()}
						</Caption>
					</View>
				</View>
				<Divider />

				{comments &&
					comments
						.sort(
							(a, b) =>
								b.postedAt.getTime() - a.postedAt.getTime()
						)
						.map((comment) => (
							<TouchableHighlight
								onLongPress={() => {
									selectComment(
										comment.username,
										comment.commentId
									);
								}}
								key={comment.commentId}
							>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										padding: 16,
										backgroundColor:
											selectedComment ===
											comment.commentId
												? "gray"
												: "black",
									}}
								>
									<UserAvatar
										profilePicture={comment.profilePic}
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
											{comment.username}
										</Text>
										<Paragraph>{comment.comment}</Paragraph>
										<Caption>
											{comment.postedAt?.toLocaleString()}
										</Caption>
									</View>
								</View>
							</TouchableHighlight>
						))}
			</ScrollView>
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
};

export default Comments;
