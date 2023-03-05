import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StatusBar } from "react-native";
import { useTheme } from "react-native-paper";
import Error from "../Components/Error";
import { User } from "../types";
import SignedInStack from "./SignedInStackNavigator";
import SignInStackNavigator from "./SignInNavigation";

type NavigationProps = {
	user?: User | null;
};

const Navigation: React.FC<NavigationProps> = ({ user }) => {
	const netInfo = useNetInfo();

	const { colors } = useTheme();
	return (
		<NavigationContainer
			linking={{
				prefixes: [
					"https://instaclone.nikketan.dev",
					"com.nikketan.instaclone://",
				],
			}}
			theme={{
				colors: {
					background: "#0f0f0f",
					border: colors.surface,
					card: "#262626",
					notification: colors.primary,
					primary: colors.primary,
					text: colors.onBackground,
				},
				dark: true,
			}}
		>
			{!netInfo.isConnected ? (
				<>
					<StatusBar
						backgroundColor="red"
						animated
						barStyle="dark-content"
					/>
					<Error message="You are offline" />
				</>
			) : (
				<StatusBar
					backgroundColor={colors.background}
					animated
					barStyle="light-content"
				/>
			)}
			<RootNavigator user={user} />
		</NavigationContainer>
	);
};

const RootNavigator: React.FC<NavigationProps> = ({ user }) => {
	if (user !== null) return <SignedInStack />;
	return <SignInStackNavigator />;
};

export default Navigation;
