import { useNavigation } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StatusBar,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import { Appbar, Text, useTheme, IconButton } from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import { MessageStackNavigationParams } from "../../types/navigation";
import { AppContext } from "../../utils/appContext";
import useMessages from "../../utils/useMessages";

type Props = {
	route: RouteProp<MessageStackNavigationParams, "Messages">;
	navigation: StackNavigationProp<MessageStackNavigationParams, "Messages">;
};

const Messages: React.FC<Props> = ({ navigation, route }) => {
	const { colors, dark } = useTheme();
	const { width } = useWindowDimensions();
	const { messages, fetchMessages, loading, newMessage } = useMessages(
		route.params.username
	);
	const [messageText, setMessageText] = useState("");
	const { username: currentUser } = useContext(AppContext);
	const goBack = () => navigation.goBack();

	const sendMessage = () => {
		setMessageText("");
		newMessage({
			receiver: route.params.username,
			text: messageText,
		});
	};

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
					backgroundColor: colors.background,
				}}
			>
				<Appbar.BackAction onPress={goBack} />
				<Appbar.Content title={route.params.username} />
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
						>
							{messages.map((message) => (
								<View
									key={message.messageId}
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent:
											message.sender === currentUser
												? "flex-end"
												: "flex-start",
									}}
								>
									<Text
										style={{
											minHeight: 48,

											maxWidth: width / 2 - 16,
											textAlignVertical: "center",
											paddingHorizontal: 16,
											backgroundColor: "#3a3a3a",
											marginHorizontal: 8,
											marginVertical: 4,
											borderRadius: 24,
										}}
									>
										{message.text}
									</Text>
								</View>
							))}
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
							<IconButton icon="send" onPress={sendMessage} />
						</View>
					</>
				)}
			</View>
		</View>
	);
};

export default Messages;
