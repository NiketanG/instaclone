import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StatusBar,
	TextInput,
	View,
} from "react-native";
import { Appbar, useTheme, IconButton } from "react-native-paper";
import ImageMessage from "../../Components/Messages/ImageMessage";
import PostMessage from "../../Components/Messages/PostMessage";
import TextMessage from "../../Components/Messages/TextMessage";
import { MessageStackNavigationParams } from "../../types/navigation";
import { AppContext } from "../../utils/appContext";
import useImageUpload from "../../utils/useImageUpload";
import useMessages from "../../utils/useMessages";

type Props = {
	route: RouteProp<MessageStackNavigationParams, "Messages">;
	navigation: StackNavigationProp<MessageStackNavigationParams, "Messages">;
};

const Messages: React.FC<Props> = ({ navigation, route }) => {
	const { colors, dark } = useTheme();
	const { messages, loading, newMessage, deleteMessage } = useMessages(
		route.params.username
	);
	const { selectFromGallery } = useImageUpload();

	const addImage = async () => {
		const uploadedImage = await selectFromGallery();
		if (!uploadedImage) {
			console.error("[addImage] Error while uploading");
			return;
		}
		newMessage({
			receiver: route.params.username,
			text: messageText,
			imageUrl: uploadedImage,
			message_type: "IMAGE",
			postId: undefined,
		});
	};

	const [messageText, setMessageText] = useState("");
	const { username: currentUser } = useContext(AppContext);
	const goBack = () => {
		if (selectedMessage) {
			setSelectedMessage(null);
		} else {
			navigation.goBack();
		}
	};

	const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

	const selectMessage = (username: string, messsageId: number) => {
		if (username === currentUser) setSelectedMessage(messsageId);
	};

	const sendMessage = () => {
		if (messageText.length === 0) return;
		setMessageText("");
		newMessage({
			receiver: route.params.username,
			text: messageText,
			imageUrl: undefined,
			message_type: "TEXT",
			postId: undefined,
		});
		scrollViewRef.current?.scrollToEnd();
	};

	const removeMessage = () => {
		if (selectedMessage) deleteMessage(selectedMessage);
		setSelectedMessage(null);
	};

	const openProfile = () => {
		navigation.navigate("Profile", {
			username: route.params.username,
			goBack: () => navigation.goBack(),
		});
	};
	const scrollViewRef = useRef<ScrollView>(null);

	useEffect(() => {
		if (scrollViewRef && !loading) scrollViewRef.current?.scrollToEnd();
	}, [scrollViewRef, loading]);

	return (
		<View
			style={{
				flex: 1,
				display: "flex",
				backgroundColor: colors.background,
			}}
		>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={dark ? "light-content" : "dark-content"}
				animated
			/>
			<Appbar.Header
				style={{
					backgroundColor: selectedMessage
						? "#009688"
						: colors.background,
				}}
			>
				<Appbar.BackAction onPress={goBack} />
				<Appbar.Content
					title={route.params.username}
					onPress={openProfile}
				/>
				{selectedMessage && (
					<Appbar.Action icon="delete" onPress={removeMessage} />
				)}
			</Appbar.Header>

			<View
				style={{
					flex: 1,
				}}
			>
				{loading ? (
					<View
						style={{
							flex: 1,
							flexGrow: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<ActivityIndicator color={colors.text} />
					</View>
				) : (
					<>
						<ScrollView
							style={{
								flex: 1,
								flexGrow: 1,
							}}
							ref={scrollViewRef}
						>
							{messages.map((message) => {
								if (message.message_type === "IMAGE")
									return (
										<ImageMessage
											key={message.messageId}
											message={message}
											selectMessage={selectMessage}
										/>
									);

								if (message.message_type === "POST")
									return (
										<PostMessage
											key={message.messageId}
											message={message}
											selectMessage={selectMessage}
										/>
									);

								if (message.message_type === "TEXT")
									return (
										<TextMessage
											key={message.messageId}
											message={message}
											selectMessage={selectMessage}
										/>
									);
							})}
						</ScrollView>
						<View
							style={{
								maxHeight: 48,
								height: 48,
								backgroundColor: "#3a3a3a",
								marginHorizontal: 8,
								marginVertical: 8,
								borderRadius: 24,
								display: "flex",
								flexDirection: "row",
							}}
						>
							<TextInput
								value={messageText}
								placeholder="Message..."
								placeholderTextColor={"gray"}
								onChangeText={(text) => setMessageText(text)}
								style={{
									flex: 1,
									paddingLeft: 16,
									color: colors.text,
								}}
								onSubmitEditing={sendMessage}
							/>
							<IconButton icon="attachment" onPress={addImage} />
							<IconButton icon="send" onPress={sendMessage} />
						</View>
					</>
				)}
			</View>
		</View>
	);
};

export default Messages;
