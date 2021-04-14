import "react-native-url-polyfill/auto";

import { AppRegistry } from "react-native";
import App from "./src/app/App.native";
import { name as appName } from "./src/app.json";

AppRegistry.registerComponent(appName, () => App);
