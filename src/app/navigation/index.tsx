import { NavigationContainer } from "@react-navigation/native";
import SignedInStack from "./SignedInStackNavigator";
import SignInStackNavigator from "./SignInNavigation";
import React from "react";
import { useTheme } from "react-native-paper";
import { User } from "../types";
import { useNetInfo } from "@react-native-community/netinfo";
import Error from "../Components/Error";
import { StatusBar } from "react-native";

type NavigationProps = {
	user?: User | null;
};

const Navigation: React.FC<NavigationProps> = ({ user }) => {
	const netInfo = useNetInfo();

	const { colors } = useTheme();
	return (
		<NavigationContainer
			theme={{
				colors: {
					background: "#0f0f0f",
					border: colors.disabled,
					card: "#262626",
					notification: colors.notification,
					primary: colors.primary,
					text: colors.text,
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
