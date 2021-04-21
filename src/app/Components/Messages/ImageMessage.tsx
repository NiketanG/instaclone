import React, { useContext, useState } from "react";
import {
	TouchableHighlight,
	View,
	Image,
	useWindowDimensions,
} from "react-native";
import { Message } from "../../store/MessagesStore";
import { AppContext } from "../../utils/appContext";

type Props = {
	message: Message;
	selectMessage: (username: string, messageId: number) => void;
	toggleImageExpand: () => void;
};
const ImageMessage: React.FC<Props> = ({
	message,
	selectMessage,
	toggleImageExpand,
}) => {
	const { username: currentUser } = useContext(AppContext);
	const { width } = useWindowDimensions();

	return (
		<TouchableHighlight
			onPress={toggleImageExpand}
			onLongPress={() => selectMessage(message.sender, message.messageId)}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent:
						message.sender === currentUser
							? "flex-end"
							: "flex-start",
				}}
			>
				<Image
					source={{
						uri: message.imageUrl,
					}}
					style={{
						height: width / 2,
						width: width / 2,
						backgroundColor: "#3a3a3a",
						marginHorizontal: 8,
						marginVertical: 4,
						borderRadius: 8,
					}}
				/>
			</View>
		</TouchableHighlight>
	);
};

export default ImageMessage;
