import React, { useContext, useState } from "react";
import {
	DeviceEventEmitter,
	Image,
	Text,
	useWindowDimensions,
} from "react-native";
import {
	Caption,
	Card,
	IconButton,
	Paragraph,
	Title,
	useTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { UserAvatar } from "../UserAvatar";
import { getTimeDistance } from "../../utils/utils";

import { FeedNavigationProp } from "../../types/navigation/PostStack";
import { PostDimensions } from "../../utils/Constants";
import { LikeFull, PostFull, PostWithUser } from "../../types";
import { useMutation, useQuery } from "react-query";
import { getPostById, toggleLike } from "../../../api";
import { queryClient } from "../../utils/queryClient";
import { AppContext } from "../../utils/appContext";

type Props = PostWithUser;

const Post: React.FC<Props> = ({
	caption,
	imageUrl,
	postId,
	postedAt,
	user,
}) => {
	const navigation = useNavigation<FeedNavigationProp>();

	const { colors } = useTheme();
	const { width } = useWindowDimensions();

	const { data } = useQuery(`postInfo_${postId}`, () => getPostById(postId), {
		enabled: postId !== null,
	});

	const { user: currentUser } = useContext(AppContext);

	const toggleLikeMutation = useMutation<
		LikeFull | boolean | null,
		unknown,
		number
	>((postToLike) => toggleLike(postToLike), {
		onMutate: async (postToLike) => {
			await queryClient.cancelQueries(`postInfo_${postId}`);

			const postData = queryClient.getQueryData<
				PostFull | null | undefined
			>(`postInfo_${postId}`);

			if (!currentUser)
				return {
					postData,
				};

			if (postData) {
				const likeIndex = postData.likes.findIndex(
					(item) => item.user.username === currentUser.username
				);
				let likes = postData.likes;

				if (likeIndex === -1) {
					likes.push({
						id: Math.random(),
						postId: postToLike,
						user: currentUser,
					});
				} else {
					likes = postData.likes.filter(
						(item) => item.user.username !== currentUser.username
					);
				}
				queryClient.setQueryData<PostFull>(`postInfo_${postId}`, {
					...postData,
					isLiked: !postData.isLiked,
					likes,
				});
			}

			return { postData };
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(`commentsOnPost_${postId}`);
		},
	});

	const [expandedCaption, setExpandedCaption] = useState(false);
	const toggleExpandCaption = () => setExpandedCaption(!expandedCaption);

	const viewProfile = () =>
		navigation.navigate("Profile" as any, {
			username: user.username,
			profilePic: user.profilePic,
			name: user.name,
		});

	const openLikes = () =>
		data && navigation.navigate("Likes", { likes: data.likes });

	const openComments = () =>
		navigation.navigate("Comments", {
			post: {
				postId,
				postedAt,
				user: user.username,
				caption,
			},
			user: {
				...user,
			},
		});

	const openMenuModal = () => {
		// openModal("MENU", user.username, postId);
		DeviceEventEmitter.emit("PostModalOpen", {
			modalType: "MENU",
			postId,
			user,
		});
	};
	const openShareModal = () => {
		// openModal("SHARE", user.username, postId);
		DeviceEventEmitter.emit("PostModalOpen", {
			modalType: "SHARE",
			postId,
			user,
		});
	};

	const likeToggle = () => {
		if (!data?.user) return;
		toggleLikeMutation.mutate(postId);
	};
	return (
		<Card
			style={{
				zIndex: 0,
				elevation: 0,
				backgroundColor: colors.background,
			}}
		>
			<Card.Title
				title={user.username}
				left={() => (
					<UserAvatar
						profilePicture={user.profilePic}
						onPress={viewProfile}
						size={28}
					/>
				)}
				leftStyle={{
					marginTop: 8,
				}}
				right={(props) => (
					<IconButton
						{...props}
						icon="dots-vertical"
						onPress={openMenuModal}
					/>
				)}
				titleStyle={{
					fontSize: 18,
					marginLeft: -16,
				}}
				style={{
					borderBottomColor: colors.placeholder,
					borderBottomWidth: 0.5,
					alignItems: "center",
					display: "flex",
					flexDirection: "row",
				}}
			/>

			<Image
				source={{ uri: imageUrl }}
				width={PostDimensions.width}
				height={PostDimensions.height}
				style={{
					width,
					height: width,
				}}
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
					onPress={likeToggle}
					color={colors.text}
					backgroundColor="transparent"
					name={data?.isLiked ? "heart" : "heart-outline"}
					size={22}
				/>
				<Icon.Button
					style={{
						margin: 0,
						paddingLeft: 8,
						paddingRight: 0,
					}}
					color={colors.text}
					onPress={openComments}
					backgroundColor="transparent"
					name="chatbubble-outline"
					size={22}
				/>
				<Icon.Button
					style={{
						margin: 0,
						paddingLeft: 8,
						paddingRight: 0,
					}}
					onPress={openShareModal}
					color={colors.text}
					backgroundColor="transparent"
					name={"paper-plane-outline"}
					size={22}
				/>
			</Card.Actions>
			<Card.Content>
				{data && data.likes.length > 0 && (
					<Text
						onPress={openLikes}
						style={{
							color: colors.placeholder,
						}}
					>
						{data.likes.length > 1
							? `${data.likes.length} likes`
							: `1 like`}
					</Text>
				)}
				<Title>{user.username}</Title>
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
				<Caption>{getTimeDistance(postedAt)}</Caption>
			</Card.Content>
		</Card>
	);
};

export default Post;
