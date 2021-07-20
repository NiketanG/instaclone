import React, { useContext } from "react";
import "react-native-gesture-handler";
import { DarkTheme, Provider as PaperProvider } from "react-native-paper";
import Navigation from "./navigation";
import Splash from "./Screens/Splash";
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
	const { loading, user } = useContext(AppContext);

	if (loading) return <Splash />;

	return <Navigation user={user} />;
};

const App = () => (
	<PaperProvider theme={theme}>
		<AppContextProvider>
			<Main />
		</AppContextProvider>
	</PaperProvider>
);

export default App;
