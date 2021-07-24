import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Caption, Text } from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import { UserMin } from "../../types";

type NewChatItemProps = {
	item: UserMin;
	openMessage: (user: UserMin) => void;
};

const NewChatItem: React.FC<NewChatItemProps> = ({ item, openMessage }) => {
	return (
		<TouchableOpacity
			key={item.username}
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				margin: 16,
			}}
			onPress={() => openMessage(item)}
		>
			<UserAvatar size={32} profilePicture={item.profilePic} />
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
				<Caption>{item.name}</Caption>
			</View>
		</TouchableOpacity>
	);
};

export default NewChatItem;
