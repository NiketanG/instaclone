import React from "react";
import { StatusBar, View } from "react-native";
import { Title, useTheme } from "react-native-paper";

const Splash = () => {
	const { colors, dark } = useTheme();

	return (
		<>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={dark ? "light-content" : "dark-content"}
				animated
			/>
			<View
				style={{
					flex: 1,
					backgroundColor: colors.background,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Title>Instaclone</Title>
			</View>
		</>
	);
};

export default Splash;
