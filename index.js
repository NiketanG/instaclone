import "react-native-url-polyfill/auto";
import "react-native-get-random-values";

import { AppRegistry } from "react-native";
import messaging from "@react-native-firebase/messaging";

import App from "./src/app/App";
import { name as appName } from "./app.json";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	console.log("Message handled in the background!", remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
