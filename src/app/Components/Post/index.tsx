import React, { useContext, useEffect, useState } from "react";
import { Image, Text, useWindowDimensions } from "react-native";
import { Caption, Card, Paragraph, Title, useTheme } from "react-native-paper";

import Icon from "react-native-vector-icons/Ionicons";
import { Post as PostType } from "../../types";
import { postImageHeight } from "../../utils/constants";
import firestore from "@react-native-firebase/firestore";
import { AppContext } from "../../utils/authContext";

type AvatarProps = {
	profilePicture?: string | null;
	iconProps: any;
};
const UserAvatar: React.FC<AvatarProps> = ({ iconProps, profilePicture }) => {
	const { dark } = useTheme();

	// <Avatar.Icon {...props} icon="heart" size={30} />
	return profilePicture ? (
		<Image
			source={{
				uri: profilePicture,
			}}
			width={28}
			height={28}
			style={{
				width: 28,
				height: 28,
				borderRadius: 14,
			}}
		/>
	) : (
		<Icon
			{...iconProps}
			name="person-circle-outline"
			size={32}
			color={dark ? "white" : "black"}
		/>
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

	return (
		<Card
			style={{
				backgroundColor: colors.surface,
			}}
		>
			<Card.Title
				title={username}
				left={(props) => (
					<UserAvatar iconProps={props} profilePicture={profilePic} />
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
				width={postImageHeight}
				height={postImageHeight}
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
					onPress={() => {}}
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
					{postedAt.toLocaleString()}
					{/* 5 Hours ago */}
				</Caption>
				{/* {comments && comments > 0 && (
					<Caption onPress={() => {}}>
						{comments > 1
							? `View ${comments} comments`
							: `View 1 comment`}{" "}
					</Caption>
				)} */}
			</Card.Content>
		</Card>
	);
};

export default Post;
