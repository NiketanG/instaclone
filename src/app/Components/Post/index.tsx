import React, { useContext, useEffect, useState } from "react";
import {
	Image,
	Text,
	ToastAndroid,
	useWindowDimensions,
	View,
} from "react-native";
import {
	Caption,
	Card,
	IconButton,
	List,
	Paragraph,
	Title,
	useTheme,
} from "react-native-paper";
import { format, formatDistanceToNow } from "date-fns";
import Icon from "react-native-vector-icons/Ionicons";
import firestore from "@react-native-firebase/firestore";
import { AppContext } from "../../utils/authContext";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { UserAvatar } from "../UserAvatar";
import PostsStore, { Post as PostType } from "../../store/PostsStore";

type ModalProps = {
	closeModal: () => void;
	ownPost: boolean;
	postId: string;
	username: string;
};
const PostModal: React.FC<ModalProps> = ({ postId, closeModal, ownPost }) => {
	const { width } = useWindowDimensions();
	const navigation = useNavigation();
	const deletePost = async () => {
		try {
			await PostsStore.deletePost(postId);
			closeModal();
			navigation.goBack();
		} catch (err) {
			console.error(err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};
	const viewProfile = () => {
		closeModal();
	};
	return (
		<View
			style={{
				width,
				backgroundColor: "#2f2f2f",
				justifyContent: "center",
				position: "absolute",
				bottom: 0,
				paddingVertical: 16,
			}}
		>
			{ownPost && (
				<List.Item
					title="Delete Post"
					onPress={deletePost}
					style={{
						paddingHorizontal: 16,
					}}
				/>
			)}

			<List.Item
				title="View Profile"
				onPress={viewProfile}
				style={{
					paddingHorizontal: 16,
				}}
			/>
		</View>
	);
};

type User = {
	username: string;
	profilePic?: string | null;
};

type Props = Pick<
	PostType,
	"imageUrl" | "caption" | "likes" | "postedAt" | "postId"
> & {
	user: User;
};

const Post: React.FC<Props> = ({
	caption,
	imageUrl,
	likes,
	postId,
	postedAt,
	user: { username, profilePic },
}) => {
	const navigation = useNavigation();

	const [liked, setLiked] = useState(false);
	const toggleLike = () => {
		if (liked) {
			unlikePost();
		} else {
			likePost();
		}
	};
	const { colors } = useTheme();
	const { width } = useWindowDimensions();

	const [expandedCaption, setExpandedCaption] = useState(false);
	const toggleExpandCaption = () => setExpandedCaption(!expandedCaption);

	const { username: currentUsername } = useContext(AppContext);
	const likesCollection = firestore().collection("likes");

	const usersCollection = firestore().collection("users");

	useEffect(() => {
		(async () => {
			if (!postId) return;
			if (!currentUsername) return;
			const postRes = await likesCollection
				.where("postId", "==", postId)
				.where("username", "==", currentUsername)
				.get();
			if (postRes.docs.length === 0) {
				setLiked(false);
				return;
			} else {
				setLiked(true);
			}
		})();
	}, [currentUsername, likesCollection, postId]);

	const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
	useEffect(() => {
		(async () => {
			if (!username) return;
			if (profilePic) {
				setUserProfilePic(profilePic);
				return;
			} else {
				const userRes = await usersCollection
					.where("username", "==", username)
					.get();
				if (userRes.docs.length === 0) {
					setUserProfilePic(null);
					return;
				} else {
					setUserProfilePic(
						userRes.docs[0].get("profilePic") as string
					);
				}
			}
		})();
	}, [currentUsername, usersCollection, username, profilePic]);

	const likePost = async () => {
		try {
			setLiked(true);
			if (!postId) return;
			if (!currentUsername) return;

			const postRes = await likesCollection
				.where("postId", "==", postId)
				.where("username", "==", currentUsername)
				.get();
			if (postRes.docs.length === 0) {
				await likesCollection.add({
					postId,
					username: currentUsername,
					likedAt: firestore.FieldValue.serverTimestamp(),
				});
			}
		} catch (err) {
			console.error(err);
		}
	};

	const unlikePost = async () => {
		try {
			setLiked(false);
			if (!postId) return;
			if (!currentUsername) return;
			const postRes = await likesCollection
				.where("postId", "==", postId)
				.where("username", "==", currentUsername)
				.get();

			if (postRes.docs.length === 0) {
				setLiked(false);
			} else {
				const post = postRes.docs[0];
				await likesCollection.doc(post.id).delete();
			}
		} catch (err) {
			console.error(err);
		}
	};

	const [showModal, setShowModal] = useState(false);

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => setShowModal(false);

	return (
		<>
			<Modal
				hideModalContentWhileAnimating
				isVisible={showModal}
				useNativeDriverForBackdrop
				onBackdropPress={closeModal}
				onBackButtonPress={closeModal}
				animationIn="slideInUp"
				style={{
					margin: 0,
				}}
			>
				<PostModal
					username={username}
					postId={postId}
					ownPost={currentUsername === username}
					closeModal={closeModal}
				/>
			</Modal>
			<Card
				style={{
					backgroundColor: colors.background,
				}}
			>
				<Card.Title
					title={username}
					left={() => <UserAvatar profilePicture={userProfilePic} />}
					right={(props) => (
						<IconButton
							{...props}
							icon="dots-vertical"
							onPress={openModal}
						/>
					)}
					titleStyle={{
						fontSize: 18,
						marginLeft: -16,
					}}
					style={{
						borderBottomColor: colors.placeholder,
						borderBottomWidth: 0.5,
					}}
				/>

				<Image
					source={{ uri: imageUrl }}
					style={{
						width,
						height: width,
					}}
					width={width}
					height={width}
				/>
				<Card.Actions
					style={{
						marginTop: -4,
						marginBottom: -8,
					}}
				>
					<Icon.Button
						style={{
							margin: 0,
							paddingLeft: 8,
							paddingRight: 0,
						}}
						onPress={toggleLike}
						color={colors.text}
						backgroundColor="transparent"
						name={liked ? "heart" : "heart-outline"}
						size={22}
					/>
					<Icon.Button
						style={{
							margin: 0,
							paddingLeft: 8,
							paddingRight: 0,
						}}
						color={colors.text}
						onPress={() => {
							navigation.navigate("Comments", {
								post: {
									caption,
									postedAt,
									postId,
								},
								user: {
									username,
									profilePic,
								},
							});
						}}
						backgroundColor="transparent"
						name="chatbubble-outline"
						size={22}
					/>
				</Card.Actions>
				<Card.Content>
					{likes > 0 && (
						<Text>{likes > 1 ? `${likes} likes` : `1 like`} </Text>
					)}
					<Title>{username}</Title>
					<Paragraph
						numberOfLines={expandedCaption ? undefined : 1}
						onPress={toggleExpandCaption}
					>
						{caption}
					</Paragraph>

					{caption.length > 50 && (
						<Text
							style={{
								fontWeight: "bold",
							}}
						>
							{expandedCaption ? "Less" : "More"}
						</Text>
					)}
					<Caption>
						{new Date(postedAt).getTime() >
						new Date().getTime() - 1 * 24 * 60 * 60 * 1000
							? `${formatDistanceToNow(new Date(postedAt))} ago`
							: format(new Date(postedAt), "LLLL dd, yyyy")}
					</Caption>
				</Card.Content>
			</Card>
		</>
	);
};

export default Post;
