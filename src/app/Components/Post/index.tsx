import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { UserAvatar } from "../UserAvatar";
import { Post as PostType } from "../../store/PostsStore";
import usePost from "../../utils/usePost";
import { getTimeDistance } from "../../utils/utils";

import { User } from "../../store/UsersStore";
import useUser from "../../utils/useUser";

type Props = Pick<PostType, "imageUrl" | "caption" | "postedAt" | "postId"> & {
	user: Pick<User, "username" | "profilePic">;
	openModal: (
		modalType: "MENU" | "SHARE",
		username: string,
		postId: number
	) => void;

	closeModal: (modalType: "MENU" | "SHARE") => void;
};

const Post: React.FC<Props> = ({
	caption,
	imageUrl,
	postId,
	postedAt,
	user: { username, profilePic },
	openModal,
}) => {
	const navigation = useNavigation();

	const { colors } = useTheme();
	const { width } = useWindowDimensions();

	const [expandedCaption, setExpandedCaption] = useState(false);
	const toggleExpandCaption = () => setExpandedCaption(!expandedCaption);

	const { liked, likes, toggleLike } = usePost(postId);

	const { user } = useUser(username);

	const goBack = () => navigation.goBack();

	const viewProfile = () =>
		navigation.navigate("Profile", {
			username,
			goBack,
			showBackArrow: true,
		});

	const openComments = () =>
		navigation.navigate("Comments", {
			post: {
				caption,
				postedAt,
				postId,
			},
			user: {
				username,
				profilePic: profilePic || user?.profilePic,
			},
		});

	const openMenuModal = () => openModal("MENU", username, postId);
	const openShareModal = () => openModal("SHARE", username, postId);

	return (
		<>
			<Card
				style={{
					zIndex: 0,
					elevation: 0,
					backgroundColor: colors.background,
				}}
			>
				<Card.Title
					title={username}
					left={() => (
						<UserAvatar
							profilePicture={profilePic || user?.profilePic}
							onPress={viewProfile}
						/>
					)}
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
					<Caption>{getTimeDistance(postedAt)}</Caption>
				</Card.Content>
			</Card>
		</>
	);
};

export default Post;
