import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { Platform, StatusBar, View } from "react-native";
import "react-native-gesture-handler";
import {
	DarkTheme,
	Provider as PaperProvider,
	Title,
	useTheme,
} from "react-native-paper";
import SwipeTabNavigation from "./Routes/MainSwipeNavigation";
import SignInNavigation from "./Routes/SignInNavigation";
import AppContextProvider, { AppContext } from "./utils/appContext";

// eslint-disable-next-line no-undef
const theme: ReactNativePaper.Theme = {
	...DarkTheme,
	dark: true,
	colors: {
		...DarkTheme.colors,
		primary: "white",
		background: "#0f0f0f",
		surface: "#262626",
	},
};

const Main = () => {
	const { loading, signupDone } = useContext(AppContext);
	const { colors, dark } = useTheme();
	if (loading)
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

	if (signupDone) return <SwipeTabNavigation />;
	return <SignInNavigation />;
};

const App = () => (
	<PaperProvider theme={theme}>
		{Platform.OS === "web" ? (
			<style type="text/css">{`
				@font-face {
					font-family: 'MaterialCommunityIcons';
					src: url(${require("react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf")}) format('truetype');
				}
				`}</style>
		) : null}
		<NavigationContainer>
			<AppContextProvider>
				<Main />
			</AppContextProvider>
		</NavigationContainer>
	</PaperProvider>
);

export default App;
