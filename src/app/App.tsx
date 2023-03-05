import React, { useContext } from "react";
import { LogBox } from "react-native";
import "react-native-gesture-handler";
import {
	MD3DarkTheme as DarkTheme,
	Provider as PaperProvider,
} from "react-native-paper";
import { QueryClientProvider } from "react-query";
import Navigation from "./navigation";
import Splash from "./Screens/Splash";
import AppContextProvider, { AppContext } from "./utils/appContext";
import { queryClient } from "./utils/queryClient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

const theme: typeof DarkTheme = {
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
	<GestureHandlerRootView style={{ flex: 1 }}>
		<QueryClientProvider client={queryClient}>
			<PaperProvider theme={theme}>
				<AppContextProvider>
					<Main />
				</AppContextProvider>
			</PaperProvider>
		</QueryClientProvider>
	</GestureHandlerRootView>
);

export default App;
