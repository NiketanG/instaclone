import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Appbar, List } from "react-native-paper";
import { ProfileStackParams } from "../../../types/navigation";
import auth from "@react-native-firebase/auth";
import { StatusBar, View } from "react-native";

type Props = {
	navigation: StackNavigationProp<ProfileStackParams, "Settings">;
};
const Settings: React.FC<Props> = ({ navigation }) => {
	const goBack = () => navigation.goBack();

	const signOut = () => auth().signOut();

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
			<View>
				<List.Item
					title="Logout"
					onPress={signOut}
					left={(props) => <List.Icon {...props} icon="logout" />}
				/>
			</View>
		</>
	);
};

export default Settings;
