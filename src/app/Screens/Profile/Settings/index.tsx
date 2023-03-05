/* eslint-disable react/no-unstable-nested-components */
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { Appbar, Caption, List, useTheme } from "react-native-paper";
import { ProfileStackParams } from "../../../types/navigation/ProfileStack";
import { Alert, Linking, StatusBar, View } from "react-native";
import { AppContext } from "../../../utils/appContext";

type Props = {
	navigation: StackNavigationProp<ProfileStackParams, "Settings">;
};
const Settings: React.FC<Props> = ({ navigation }) => {
	const goBack = () => navigation.goBack();
	const { colors } = useTheme();
	const { signout } = useContext(AppContext);

	const openCode = async () =>
		Linking.openURL("https://github.com/NiketanG/instaclone");

	const openGithub = () => Linking.openURL("https://github.com/NiketanG");
	const signOut = () =>
		Alert.alert(
			"Are you sure you wanna log out?",
			"You will have to log in again to use the app",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Ok",
					style: "destructive",
					onPress: signout,
				},
			],
			{
				cancelable: true,
			}
		);

	return (
		<>
			<StatusBar backgroundColor="black" />
			<Appbar.Header
				style={{
					backgroundColor: "black",
				}}
			>
				<Appbar.Action icon="arrow-left" onPress={goBack} />
				<Appbar.Content title="Settings" />
			</Appbar.Header>
			<View
				style={{
					backgroundColor: colors.background,
					flex: 1,
				}}
			>
				<List.Item
					title="Logout"
					onPress={signOut}
					left={(props) => <List.Icon {...props} icon="logout" />}
				/>
				<List.Item
					title="Source Code"
					onPress={openCode}
					left={(props) => <List.Icon {...props} icon="code-tags" />}
				/>
			</View>
			<Caption style={{ marginHorizontal: 24 }}>Version: v2.0</Caption>
			<Caption
				style={{ marginHorizontal: 24, marginBottom: 16 }}
				onPress={openGithub}
			>
				By NiketanG
			</Caption>
		</>
	);
};

export default Settings;
