import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Caption, Text } from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import { UserMin } from "../../types";

type NewChatItemProps = {
	item: UserMin;
	openMessage: (user: UserMin) => void;
};

const NewChatItem: React.FC<NewChatItemProps> = ({ item, openMessage }) => {
	const [isLoading, setIsLoading] = useState(false);

	const onPress = () => {
		setIsLoading(true);
		openMessage(item);
	};
	return (
		<TouchableOpacity
			key={item.username}
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				margin: 16,
			}}
			onPress={onPress}
		>
			<View
				style={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
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
			</View>

			{isLoading && <ActivityIndicator size={12} />}
		</TouchableOpacity>
	);
};

export default NewChatItem;
