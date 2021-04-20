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
import { AppContext } from "../../utils/appContext";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { UserAvatar } from "../UserAvatar";
import PostsStore, { Post as PostType } from "../../store/PostsStore";
import usePost from "../../utils/usePost";
import supabaseClient from "../../utils/supabaseClient";
import { definitions } from "../../types/supabase";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackNavigationParams } from "../../types/navigation";

type ModalProps = {
	closeModal: () => void;
	ownPost: boolean;
	postId: number;
	username: string;
	viewProfile: () => void;
};
const PostModal: React.FC<ModalProps> = ({
	postId,
	closeModal,
	ownPost,
	viewProfile,
}) => {
	const { width } = useWindowDimensions();
	const navigation = useNavigation();
	const deletePost = async () => {
		try {
			await PostsStore.deletePost(postId);
			closeModal();
			navigation.goBack();
		} catch (err) {
			console.error("[deletePost]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};

	const openProfile = () => {
		closeModal();
		viewProfile();
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
				onPress={openProfile}
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

type Props = Pick<PostType, "imageUrl" | "caption" | "postedAt" | "postId"> & {
	user: User;
};

const Post: React.FC<Props> = ({
	caption,
	imageUrl,
	postId,
	postedAt,
	user: { username, profilePic },
}) => {
	const navigation = useNavigation();

	const { colors } = useTheme();
	const { width } = useWindowDimensions();

	const [expandedCaption, setExpandedCaption] = useState(false);
	const toggleExpandCaption = () => setExpandedCaption(!expandedCaption);

	const { username: currentUsername } = useContext(AppContext);

	const { liked, likes, toggleLike } = usePost(postId);

	const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
	useEffect(() => {
		(async () => {
			if (!username) return;
			if (profilePic) {
				setUserProfilePic(profilePic);
				return;
			} else {
				const userRes = await supabaseClient
					.from<definitions["users"]>("users")
					.select("*")
					.eq("username", username);

				if (userRes.error || userRes.data.length === 0) {
					console.error(
						"[fetchUserProfilePic_Response]",
						userRes.error
					);
					setUserProfilePic(null);
					return;
				} else {
					if (userRes.data[0].profilePic)
						setUserProfilePic(userRes.data[0].profilePic);
				}
			}
		})();
	}, [username, profilePic]);

	const [showModal, setShowModal] = useState(false);

	const openModal = () => setShowModal(true);

	const closeModal = () => setShowModal(false);

	const goBack = () => navigation.goBack();

	const viewProfile = () =>
		navigation.navigate("Profile", {
			username,
			isCurrentUser: false,
			goBack,
		});

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
					viewProfile={viewProfile}
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
					left={() => (
						<UserAvatar
							profilePicture={userProfilePic}
							onPress={viewProfile}
						/>
					)}
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
					{likes.length > 0 && (
						<Text
							style={{
								color: colors.placeholder,
							}}
						>
							{likes.length > 1
								? `${likes.length} likes`
								: `1 like`}
						</Text>
					)}
					<Title>{username}</Title>
					{caption ? (
						<>
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
										color: colors.placeholder,
									}}
								>
									{expandedCaption ? "Less" : "More"}
								</Text>
							)}
						</>
					) : null}
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
