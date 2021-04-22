import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Caption, Text } from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import useUser from "../../utils/useUser";

export type NewChatItemType = {
	username: string;
};

type NewChatItemProps = {
	item: NewChatItemType;
	openMessage?: (username: string) => void;
};

const NewChatItem: React.FC<NewChatItemProps> = ({ item, openMessage }) => {
	const { user } = useUser(item.username);
	return (
		<TouchableOpacity
			key={item.username}
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				margin: 16,
			}}
			onPress={() =>
				openMessage
					? openMessage(item.username)
					: console.log("no open message")
			}
		>
			<UserAvatar size={32} profilePicture={user?.profilePic} />
			<View
				style={{
					marginLeft: 16,
				}}
			>
				<Text
					style={{
						fontSize: 18,
					}}
				>
					{item.username}
				</Text>
				<Caption>{user?.name}</Caption>
			</View>
		</TouchableOpacity>
	);
};

export default NewChatItem;
