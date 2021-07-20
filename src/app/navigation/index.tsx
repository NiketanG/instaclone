import { NavigationContainer } from "@react-navigation/native";
import { User } from "../types";
import SignedInStack from "./SignedInStackNavigator";
import SignInStackNavigator from "./SignInNavigation";
import React from "react";
import { useTheme } from "react-native-paper";

type NavigationProps = {
	user: User | null;
};

const Navigation: React.FC<NavigationProps> = ({ user }) => {
	const { colors, dark } = useTheme();
	return (
		<NavigationContainer
			theme={{
				colors: {
					background: colors.background,
					border: colors.disabled,
					card: colors.surface,
					notification: colors.notification,
					primary: colors.primary,
					text: colors.text,
				},
				dark,
			}}
		>
			<RootNavigator user={user} />
		</NavigationContainer>
	);
};

const RootNavigator: React.FC<NavigationProps> = ({ user }) => {
	if (user !== null) return <SignedInStack />;
	return <SignInStackNavigator />;
};

export default Navigation;
