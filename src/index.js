import { AppRegistry, Platform } from "react-native";
import App from "./app/App.native";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
if (Platform.OS === "web") {
	AppRegistry.runApplication(appName, {
		// Mount the react-native app in the "root" div of index.html
		rootTag: document.getElementById("root"),
	});
}
