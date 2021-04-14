/* eslint-disable @typescript-eslint/no-unused-vars */
import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { Platform } from "react-native";
import "react-native-gesture-handler";
import { DarkTheme, Provider as PaperProvider, Text } from "react-native-paper";
import { TabNavigation } from "./Routes/Navigation";
import SignInNavigation from "./Routes/SignInNavigation";
import AppContextProvider, { AppContext } from "./utils/authContext";

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
	const { signupDone } = useContext(AppContext);

	if (signupDone) return <TabNavigation />;
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
