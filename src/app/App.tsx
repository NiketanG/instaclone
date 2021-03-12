import "react-native-gesture-handler";
import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DarkTheme, Provider as PaperProvider } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import { Platform, Text, View } from "react-native";
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
	},
};

const Main = () => {
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState(null);
	const { signupDone } = useContext(AppContext);

	const onAuthStateChanged = (newUser: any) => {
		setUser(newUser);
		if (initializing) setInitializing(false);
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (initializing)
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);

	return !user || !signupDone ? <SignInNavigation /> : <TabNavigation />;
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
