import React, { useContext } from "react";
import { LogBox } from "react-native";
import "react-native-gesture-handler";
import { DarkTheme, Provider as PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "react-query";
import Navigation from "./navigation";
import Splash from "./Screens/Splash";
import AppContextProvider, { AppContext } from "./utils/appContext";
import { queryClient } from "./utils/queryClient";
LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

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
	const { user: currUser, loading } = useContext(AppContext);

	if (loading) return <Splash />;

	return <Navigation user={currUser} />;
};

const App = () => (
	<QueryClientProvider client={queryClient}>
		<PaperProvider theme={theme}>
			<AppContextProvider>
				<Main />
			</AppContextProvider>
		</PaperProvider>
	</QueryClientProvider>
);

export default App;
