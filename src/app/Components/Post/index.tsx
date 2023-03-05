/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Image, Text, useWindowDimensions } from "react-native";
import {
	Caption,
	Card,
	IconButton,
	Paragraph,
	Title,
	useTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { getTimeDistance } from "../../utils/utils";
import { UserAvatar } from "../UserAvatar";

import { useMutation, useQuery } from "react-query";
import { getPostById, toggleLike } from "../../../api";
import { LikeFull, PostFull, PostWithUser } from "../../types";
import { FeedNavigationProp } from "../../types/navigation/PostStack";
import { AppContext } from "../../utils/appContext";
import { PostDimensions } from "../../utils/Constants";
import { queryClient } from "../../utils/queryClient";

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
		navigation.navigate("PostMenu" as any, {
			postId,
			user,
		});
	};
	const openShareModal = () => {
		navigation.navigate("PostShareMenu" as any, {
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
					borderBottomColor: colors.surface,
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
					backgroundColor: colors.surface,
					width,
					height: width,
				}}
			/>
			<Card.Actions
				style={{
					alignSelf: "flex-start",
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
					color={colors.onBackground}
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
					color={colors.onBackground}
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
					color={colors.onBackground}
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
							color: colors.onSurface,
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
									color: colors.onSurface,
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
