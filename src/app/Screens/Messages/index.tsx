import { RouteProp, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StatusBar,
	TextInput,
	View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Appbar, Divider, Text, useTheme } from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import { MessageStackNavigationParams } from "../../types/navigation";
import useMessageList from "../../utils/useMessageList";

type Props = {
	route: RouteProp<MessageStackNavigationParams, "MessageList">;
	navigation: StackNavigationProp<
		MessageStackNavigationParams,
		"MessageList"
	>;
};
const MessagesList: React.FC<Props> = ({ navigation }) => {
	const { colors, dark } = useTheme();
	const { messageList, loading, fetchMessageList } = useMessageList();
	const [searchTerm, setSearchTerm] = useState("");

	const newMessage = () => {
		console.log("new");
	};
	const goBack = () => navigation.goBack();

	const openMessage = (username: string) => {
		navigation.navigate("Messages", {
			username,
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
				<Appbar.Content title="Messages" />
				<Appbar.Action icon="plus" onPress={fetchMessageList} />
			</Appbar.Header>

			{loading && (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<ActivityIndicator color={colors.text} />
				</View>
			)}
			<ScrollView
				style={{
					flex: 1,
				}}
			>
				<TextInput
					placeholder="Search"
					placeholderTextColor={"gray"}
					onChangeText={(text) => setSearchTerm(text)}
					style={{
						flex: 1,
						marginHorizontal: 16,
						marginVertical: 16,
						height: 40,
						backgroundColor: "#3a3a3a",
						borderRadius: 6,
						paddingHorizontal: 16,
						color: colors.text,
					}}
				/>
				<Divider />

				{messageList.map((messageListItem) => (
					<TouchableOpacity
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							margin: 16,
						}}
						onPress={() => openMessage("niketan")}
					>
						<UserAvatar size={32} />
						<Text
							style={{
								marginLeft: 16,
								fontSize: 18,
							}}
						>
							Niketan Gulekar
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
};

export default MessagesList;
