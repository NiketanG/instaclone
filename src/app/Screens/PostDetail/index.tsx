import React, { useState } from "react";
import { Text } from "react-native";
import { Caption, Card, Paragraph, Title } from "react-native-paper";

import Icon from "react-native-vector-icons/Ionicons";

type AvatarProps = {
	profilePicture?: string;
	iconProps: any;
};
const UserAvatar: React.FC<AvatarProps> = ({ iconProps, profilePicture }) => (
	// <Avatar.Icon {...props} icon="heart" size={30} />
	<Icon {...iconProps} name="person-circle-outline" size={24} />
);

type Props = {
	username: string;
	imageUrl: string;
	caption: string | "";
	likes: number;
	location?: string;
	time: string | number;
	comments?: number;
};

const PostDetail: React.FC<Props> = ({
	caption,
	imageUrl,
	likes,
	username,
	time,
	comments,
}) => {
	const [liked, setLiked] = useState(false);
	const toggleLike = () => {
		setLiked(!liked);
	};

	return (
		<Card
			style={{
				borderBottomColor: "rgb(64,64,64)",
				borderBottomWidth: 0.5,
			}}
		>
			<Card.Title
				title={username}
				left={(props) => <UserAvatar iconProps={props} />}
				titleStyle={{
					fontSize: 18,
					marginLeft: -16,
				}}
			/>

			<Card.Cover source={{ uri: imageUrl }} />
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
				<Paragraph>{caption}</Paragraph>
				<Caption>
					{time}
					{/* 5 Hours ago */}
				</Caption>
				{comments && comments > 0 && (
					<Caption onPress={() => {}}>
						{comments > 1
							? `View ${comments} comments`
							: `View 1 comment`}{" "}
					</Caption>
				)}
			</Card.Content>
		</Card>
	);
};

export default PostDetail;
